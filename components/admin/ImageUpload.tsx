'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { RecipeImage } from '@/lib/supabase'
import {
  uploadRecipeImage,
  addRecipeImageRecord,
  deleteRecipeImageRecord,
  setPrimaryImage,
} from '@/lib/supabase'

interface ImageUploadProps {
  recipeId: number
  images: RecipeImage[]
  onImagesChange: () => void
}

export default function ImageUpload({ recipeId, images, onImagesChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(`Uploading ${files.length} image(s)...`)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        console.log(`Processing file ${i + 1} of ${files.length}:`, file.name)
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`)

        // Upload to storage
        console.log('Calling uploadRecipeImage...')
        const result = await uploadRecipeImage(file, recipeId)
        console.log('Upload result:', result)

        if (!result) {
          console.error(`Upload failed for ${file.name}`)
          alert(`Failed to upload ${file.name}. Check console for details.`)
          continue
        }

        // Add database record
        const isPrimary = images.length === 0 && i === 0 // First image of first upload
        const displayOrder = images.length + i

        console.log('Adding database record...')
        const dbRecord = await addRecipeImageRecord(
          recipeId,
          result.path,
          result.url,
          isPrimary,
          displayOrder,
          file.name.replace(/\.[^/.]+$/, '') // Remove extension for alt text
        )
        console.log('Database record result:', dbRecord)
      }

      setUploadProgress('Upload complete!')
      onImagesChange()

      // Reset file input
      e.target.value = ''

      setTimeout(() => {
        setUploadProgress('')
      }, 2000)
    } catch (error) {
      console.error('Upload error in handleFileSelect:', error)
      alert('Error uploading images. Check console for details.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSetPrimary(imageId: number) {
    const success = await setPrimaryImage(imageId)
    if (success) {
      onImagesChange()
    } else {
      alert('Failed to set primary image')
    }
  }

  async function handleDelete(imageId: number) {
    if (!confirm('Are you sure you want to delete this image?')) return

    const success = await deleteRecipeImageRecord(imageId)
    if (success) {
      onImagesChange()
    } else {
      alert('Failed to delete image')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-text-dark mb-2">
          Recipe Images
        </label>
        <p className="text-sm text-text-medium mb-3">
          Upload images for this recipe. The first image or marked primary image will be used on the homepage.
        </p>

        <div className="flex items-center gap-4">
          <label className="btn-primary cursor-pointer">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? 'Uploading...' : '+ Add Images'}
          </label>

          {uploadProgress && (
            <span className="text-sm text-primary font-medium">
              {uploadProgress}
            </span>
          )}
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative group border-2 rounded-lg overflow-hidden ${
                image.is_primary ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <div className="aspect-square relative">
                <Image
                  src={image.public_url}
                  alt={image.alt_text || 'Recipe image'}
                  fill
                  className="object-cover"
                />
              </div>

              {image.is_primary && (
                <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                  Primary
                </div>
              )}

              {/* Hover overlay with actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                {!image.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="bg-white text-primary px-3 py-1 rounded text-sm font-semibold hover:bg-primary-light"
                  >
                    Set as Primary
                  </button>
                )}

                <button
                  onClick={() => handleDelete(image.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 truncate">
                Order: {image.display_order}
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-text-medium">
          <p className="text-sm">No images uploaded yet</p>
          <p className="text-xs mt-1">Click "+ Add Images" to upload</p>
        </div>
      )}
    </div>
  )
}
