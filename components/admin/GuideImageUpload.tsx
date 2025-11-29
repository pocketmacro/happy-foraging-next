'use client'

import { useState, useRef, DragEvent } from 'react'
import Image from 'next/image'
import { uploadGuideImage, deleteGuideImage, setGuideImagePrimary, type GuideImage } from '@/lib/supabase'
import { useNotification } from '@/hooks/useNotification'

interface GuideImageUploadProps {
  guideId: number
  images: GuideImage[]
  onImagesChange: () => void
}

export default function GuideImageUpload({ guideId, images, onImagesChange }: GuideImageUploadProps) {
  const { showSuccess, showError, showErrorModal, showConfirmModal, NotificationContainer } = useNotification()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return

    setUploading(true)
    setUploadProgress(`Uploading ${files.length} image(s)...`)

    let successCount = 0
    let failCount = 0

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`)

        // Validate file type
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} is not an image file`)
          failCount++
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          showError(`${file.name} is too large (max 5MB)`)
          failCount++
          continue
        }

        // First image should be primary
        const isPrimary = images.length === 0 && i === 0

        const uploaded = await uploadGuideImage(guideId, file, isPrimary)

        if (uploaded) {
          successCount++
        } else {
          failCount++
        }
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      setUploadProgress('')

      if (successCount > 0) {
        showSuccess(`Successfully uploaded ${successCount} image${successCount === 1 ? '' : 's'}`)
        onImagesChange()
      }

      if (failCount > 0) {
        showErrorModal('Upload Failed', `Failed to upload ${failCount} image${failCount === 1 ? '' : 's'}. Please try again.`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      showErrorModal('Upload Failed', 'An error occurred during upload. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress('')
    }
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
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

  async function handleDelete(imageId: number, e?: React.MouseEvent) {
    e?.stopPropagation()
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

  async function handleSetPrimary(imageId: number, e?: React.MouseEvent) {
    e?.stopPropagation()
    const success = await setGuideImagePrimary(imageId, guideId)
    if (success) {
      showSuccess('Primary image updated')
      onImagesChange()
    } else {
      showErrorModal('Update Failed', 'Failed to set primary image. Please try again.')
    }
  }

  return (
    <>
      {NotificationContainer()}
      <div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-text-dark mb-2">
            Upload Guide Images
          </label>
          <p className="text-xs text-text-medium mb-3">
            First image will be set as primary (shown on guide cards). Additional images appear in the gallery.
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
            onChange={handleFileUpload}
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
                  Supports multiple files (max 5MB each)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

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
                    type="button"
                    onClick={(e) => handleSetPrimary(image.id, e)}
                    className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-sm"
                  >
                    Set Primary
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => handleDelete(image.id, e)}
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
    </>
  )
}
