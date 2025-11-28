'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getGuides, createGuide, updateGuide, deleteGuide, type Guide } from '@/lib/supabase'
import MarkdownEditor from '@/components/admin/MarkdownEditor'

type GuideFormData = {
  title: string
  description: string
  content: string
  icon: string
  category: string
  tags: string
  published: boolean
}

export default function GuidesAdminPage() {
  const searchParams = useSearchParams()
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams?.get('new') === 'true')
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null)
  const [formData, setFormData] = useState<GuideFormData>({
    title: '',
    description: '',
    content: '',
    icon: '🌿',
    category: 'beginner',
    tags: '',
    published: true,
  })

  useEffect(() => {
    loadGuides()
  }, [])

  async function loadGuides() {
    setLoading(true)
    const data = await getGuides()
    setGuides(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      content: '',
      icon: '🌿',
      category: 'beginner',
      tags: '',
      published: true,
    })
    setEditingGuide(null)
    setShowForm(false)
  }

  function handleEdit(guide: Guide) {
    setEditingGuide(guide)
    setFormData({
      title: guide.title,
      description: guide.description,
      content: guide.content,
      icon: guide.icon || '🌿',
      category: guide.category || 'beginner',
      tags: guide.tags?.join(', ') || '',
      published: guide.published,
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const guideData = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
    }

    if (editingGuide) {
      const updated = await updateGuide(editingGuide.id, guideData)
      if (!updated) {
        alert('Error updating guide')
        return
      }
    } else {
      const created = await createGuide(guideData)
      if (!created) {
        alert('Error creating guide')
        return
      }
    }

    resetForm()
    loadGuides()
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this guide?')) return

    const success = await deleteGuide(id)
    if (success) {
      loadGuides()
    } else {
      alert('Error deleting guide')
    }
  }

  const categories = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'safety', label: 'Safety' },
    { value: 'identification', label: 'Identification' },
    { value: 'seasonal', label: 'Seasonal' },
    { value: 'preservation', label: 'Preservation' },
    { value: 'advanced', label: 'Advanced' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Manage Guides</h1>
          <p className="text-text-medium">Create and edit your foraging guides</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancel' : '+ Add Guide'}
        </button>
      </div>

      {/* Guide Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-dark mb-6">
            {editingGuide ? 'Edit Guide' : 'New Guide'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                placeholder="A brief summary of what this guide covers"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Icon (emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🌿"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="safety, beginner, mushrooms"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <MarkdownEditor
              label="Content"
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="# Main Heading

## Introduction

Write your foraging guide content here. You can use Markdown formatting:

- **Bold text** for emphasis
- *Italic text* for notes
- # Headings for sections
- Lists with - or 1.
- Links: [text](url)
- Images: ![alt](url)
- Code blocks with \`\`\`"
              height={500}
              required
            />

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="published" className="text-sm font-medium text-text-dark">
                Publish guide (visible to public)
              </label>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingGuide ? 'Update Guide' : 'Create Guide'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Guides List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-text-dark mb-4">All Guides</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : guides.length === 0 ? (
            <p className="text-text-medium text-center py-8">No guides yet. Create your first one!</p>
          ) : (
            <div className="space-y-4">
              {guides.map((guide) => (
                <div key={guide.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{guide.icon}</span>
                        <h3 className="text-lg font-bold text-text-dark">{guide.title}</h3>
                        {!guide.published && (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Draft</span>
                        )}
                      </div>
                      <p className="text-text-medium text-sm mb-2">{guide.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-text-medium">
                        {guide.category && (
                          <span className="bg-primary/10 px-2 py-1 rounded capitalize">{guide.category}</span>
                        )}
                        {guide.tags && guide.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(guide)}
                        className="text-primary hover:text-primary-dark font-medium px-3 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(guide.id)}
                        className="text-red-600 hover:text-red-800 font-medium px-3 py-1"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
