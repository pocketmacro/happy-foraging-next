'use client'

import { useState } from 'react'
import Image from 'next/image'
import { uploadGuideImage, deleteGuideImage, setGuideImagePrimary, type GuideImage } from '@/lib/supabase'
import { useNotification } from '@/hooks/useNotification'

interface GuideImageUploadProps {
  guideId: number
  images: GuideImage[]
  onImagesChange: () => void
}

export default function GuideImageUpload({ guideId, images, onImagesChange }: GuideImageUploadProps) {
  const { showSuccess, showError, showErrorModal, showConfirmModal } = useNotification()
  const [uploading, setUploading] = useState(false)

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please upload an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image must be less than 5MB')
      return
    }

    setUploading(true)

    // First image should be primary
    const isPrimary = images.length === 0

    const uploaded = await uploadGuideImage(guideId, file, isPrimary)

    setUploading(false)

    if (uploaded) {
      showSuccess('Image uploaded successfully')
      onImagesChange()
      // Reset file input
      e.target.value = ''
    } else {
      showErrorModal('Upload Failed', 'Failed to upload image. Please try again.')
    }
  }

  async function handleDelete(imageId: number) {
    showConfirmModal(
      'Delete Image',
      'Are you sure you want to delete this image?',
      async () => {
        const success = await deleteGuideImage(imageId)
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

  async function handleSetPrimary(imageId: number) {
    const success = await setGuideImagePrimary(imageId, guideId)
    if (success) {
      showSuccess('Primary image updated')
      onImagesChange()
    } else {
      showErrorModal('Update Failed', 'Failed to set primary image. Please try again.')
    }
  }

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-text-dark mb-2">
          Upload Guide Images
        </label>
        <p className="text-xs text-text-medium mb-3">
          First image will be set as primary (shown on guide cards). Additional images appear in the gallery.
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50"
        />
      </div>

      {uploading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-sm text-text-medium mt-2">Uploading...</p>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                <Image
                  src={image.public_url}
                  alt={image.alt_text || 'Guide image'}
                  fill
                  className="object-cover"
                />
                {image.is_primary && (
                  <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 rounded text-xs font-semibold">
                    Primary
                  </div>
                )}
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {!image.is_primary && (
                  <button
                    onClick={() => handleSetPrimary(image.id)}
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  onClick={() => handleDelete(image.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
