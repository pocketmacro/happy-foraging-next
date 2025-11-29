'use client'

import { useState, useRef, DragEvent } from 'react'
import Image from 'next/image'
import type { RecipeImage } from '@/lib/supabase'
import {
  uploadRecipeImage,
  addRecipeImageRecord,
  deleteRecipeImageRecord,
  setPrimaryImage,
} from '@/lib/supabase'
import { useNotification } from '@/hooks/useNotification'

interface ImageUploadProps {
  recipeId: number
  images: RecipeImage[]
  onImagesChange: () => void
}

export default function ImageUpload({ recipeId, images, onImagesChange }: ImageUploadProps) {
  const { showSuccess, showError, showErrorModal, showConfirmModal, NotificationContainer } = useNotification()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(`Uploading ${files.length} image(s)...`)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`)

        // Upload to storage
        const result = await uploadRecipeImage(file, recipeId)

        if (!result) {
          alert(`Failed to upload ${file.name}. Check console for details.`)
          continue
        }

        // Add database record
        const isPrimary = images.length === 0 && i === 0 // First image of first upload
        const displayOrder = images.length + i

        await addRecipeImageRecord(
          recipeId,
          result.path,
          result.url,
          isPrimary,
          displayOrder,
          file.name.replace(/\.[^/.]+$/, '') // Remove extension for alt text
        )
      }

      setUploadProgress('Upload complete!')
      onImagesChange()

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setTimeout(() => {
        setUploadProgress('')
      }, 2000)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Error uploading images. Check console for details.')
    } finally {
      setUploading(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    handleFiles(e.target.files)
  }

  function handleDrag(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  function handleClick() {
    fileInputRef.current?.click()
  }

  async function handleSetPrimary(imageId: number, e?: React.MouseEvent) {
    e?.stopPropagation()
    const success = await setPrimaryImage(imageId)
    if (success) {
      showSuccess('Primary image updated')
      onImagesChange()
    } else {
      showErrorModal('Update Failed', 'Failed to set primary image. Please try again.')
    }
  }

  function handleDelete(imageId: number, e?: React.MouseEvent) {

    e?.stopPropagation()
    e?.preventDefault()

    showConfirmModal(
      'Delete Image',
      'Are you sure you want to delete this image?',
      async () => {
        const success = await deleteRecipeImageRecord(imageId)
        if (success) {
          showSuccess('Image deleted successfully')
          onImagesChange()
        } else {
          showErrorModal('Delete Failed', 'Failed to delete image. Please try again.')
        }
      },
      { variant: 'danger', confirmText: 'Delete' }
    )
  }

  return (
    <>
      {NotificationContainer()}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text-dark mb-2">
            Recipe Images
          </label>
          <p className="text-sm text-text-medium mb-3">
            Upload images for this recipe. The first image or marked primary image will be used on the homepage.
          </p>

        {/* Drag and Drop Zone */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-primary bg-primary/10'
              : 'border-gray-300 hover:border-primary hover:bg-gray-50'
          } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-3">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>

            {uploading ? (
              <div className="space-y-2">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-sm text-primary font-medium">{uploadProgress}</p>
              </div>
            ) : (
              <>
                <p className="text-lg font-semibold text-text-dark">
                  Drag and drop images here
                </p>
                <p className="text-sm text-text-medium">
                  or click to browse files
                </p>
                <p className="text-xs text-text-medium">
                  Supports multiple files
                </p>
              </>
            )}
          </div>
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
                    type="button"
                    onClick={(e) => handleSetPrimary(image.id, e)}
                    className="bg-white text-primary px-3 py-1 rounded text-sm font-semibold hover:bg-primary-light"
                  >
                    Set as Primary
                  </button>
                )}

                <button
                  type="button"
                  onClick={(e) => handleDelete(image.id, e)}
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
    </>
  )
}
