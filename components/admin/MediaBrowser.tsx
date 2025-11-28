'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { listContentImages, deleteContentImage } from '@/lib/supabase'

interface MediaBrowserProps {
  onSelect: (url: string, name: string) => void
  onClose: () => void
  contentType: 'recipes' | 'guides'
}

export default function MediaBrowser({ onSelect, onClose, contentType }: MediaBrowserProps) {
  const [images, setImages] = useState<Array<{
    url: string
    name: string
    path: string
    size: number
    created_at: string
  }>>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    loadImages()
  }, [contentType])

  async function loadImages() {
    setLoading(true)
    const data = await listContentImages(contentType)
    setImages(data)
    setLoading(false)
  }

  async function handleDelete(path: string, e: React.MouseEvent) {
    e.stopPropagation()

    if (!confirm('Are you sure you want to delete this image?')) {
      return
    }

    const success = await deleteContentImage(path)
    if (success) {
      // Remove from list
      setImages(images.filter(img => img.path !== path))
      if (selectedImage === path) {
        setSelectedImage(null)
      }
    } else {
      alert('Failed to delete image')
    }
  }

  function handleSelect() {
    const selected = images.find(img => img.path === selectedImage)
    if (selected) {
      onSelect(selected.url, selected.name.replace(/\.[^/.]+$/, ''))
      onClose()
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-text-dark">Media Library</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-2">No images uploaded yet</p>
              <p className="text-sm text-gray-400">Use the "Upload Image" button to add images</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.path}
                  onClick={() => setSelectedImage(image.path)}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === image.path
                      ? 'border-primary ring-2 ring-primary'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={image.url}
                      alt={image.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2">
                    <p className="text-xs font-medium text-center mb-1 truncate w-full">
                      {image.name}
                    </p>
                    <p className="text-xs text-gray-300">
                      {formatFileSize(image.size)}
                    </p>
                    <button
                      onClick={(e) => handleDelete(image.path, e)}
                      className="mt-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>

                  {/* Selected indicator */}
                  {selectedImage === image.path && (
                    <div className="absolute top-2 right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center">
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            {selectedImage ? `Selected: ${images.find(img => img.path === selectedImage)?.name}` : 'Select an image to insert'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900"
            >
              Cancel
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedImage}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
