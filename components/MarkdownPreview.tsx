'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import '@uiw/react-markdown-preview/markdown.css'

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview'),
  { ssr: false }
)

interface MarkdownPreviewProps {
  content: string
  className?: string
}

export default function MarkdownPreview({ content, className = '' }: MarkdownPreviewProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={className}>
        <p className="text-text-dark leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    )
  }

  return (
    <div className={`markdown-preview prose prose-lg max-w-none ${className}`} data-color-mode="light">
      <MDPreview source={content} />
    </div>
  )
}
