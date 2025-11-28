'use client'

import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { uploadContentImage } from '@/lib/supabase'
import MediaBrowser from './MediaBrowser'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

// Import the editor dynamically to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: number
  label?: string
  required?: boolean
  contentType?: 'recipes' | 'guides'
}

type PreviewMode = 'live' | 'edit' | 'preview'

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Start typing...',
  height = 500,
  label,
  required = false,
  contentType = 'recipes',
}: MarkdownEditorProps) {
  const [mounted, setMounted] = useState(false)
  const [previewMode, setPreviewMode] = useState<PreviewMode>('live')
  const [uploading, setUploading] = useState(false)
  const [showMediaBrowser, setShowMediaBrowser] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const result = await uploadContentImage(file, contentType)

      if (result) {
        // Insert markdown image syntax at cursor position or end
        const imageMarkdown = `![${file.name.replace(/\.[^/.]+$/, '')}](${result.url})\n`
        onChange(value + '\n' + imageMarkdown)
      } else {
        alert('Failed to upload image. Please try again.')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      alert('Error uploading image')
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  function handleMediaSelect(url: string, name: string) {
    // Insert markdown image syntax
    const imageMarkdown = `![${name}](${url})\n`
    onChange(value + '\n' + imageMarkdown)
  }

  if (!mounted) {
    return (
      <div>
        {label && (
          <label className="block text-sm font-semibold text-text-dark mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="w-full border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
          <p className="text-gray-500 text-sm">Loading editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="markdown-editor-wrapper" data-color-mode="light">
      {label && (
        <label className="block text-sm font-semibold text-text-dark mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Mode Selector and Image Upload */}
      <div className="flex justify-between items-center gap-2 mb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setPreviewMode('live')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'live'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ⚡ Live Preview
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('edit')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'edit'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📝 Edit Only
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('preview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'preview'
                ? 'bg-primary text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            👁️ Preview Only
          </button>
        </div>

        {/* Image Upload and Browse Buttons */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowMediaBrowser(true)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
          >
            🖼️ Browse Images
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="markdown-image-upload"
          />
          <label
            htmlFor="markdown-image-upload"
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer inline-block ${
              uploading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {uploading ? '⏳ Uploading...' : '📷 Upload New'}
          </label>
        </div>
      </div>

      <div className="border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-primary transition-colors">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={height}
          preview={previewMode}
          hideToolbar={false}
          enableScroll={true}
          visibleDragbar={true}
          highlightEnable={true}
          textareaProps={{
            placeholder: placeholder,
          }}
          previewOptions={{
            className: 'markdown-preview',
          }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-text-medium">
          💡 Supports Markdown: **bold**, *italic*, # headings, lists, links, images, code blocks
        </p>
        <p className="text-xs text-text-medium">
          {previewMode === 'live' && '✨ Showing editor + live preview'}
          {previewMode === 'edit' && '📝 Edit markdown source'}
          {previewMode === 'preview' && '👁️ Preview rendered output'}
        </p>
      </div>

      {/* Media Browser Modal */}
      {showMediaBrowser && (
        <MediaBrowser
          contentType={contentType}
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaBrowser(false)}
        />
      )}
    </div>
  )
}
