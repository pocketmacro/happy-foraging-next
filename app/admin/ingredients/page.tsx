'use client'

import { useState, useEffect } from 'react'
import { getIngredients, createIngredient, updateIngredient, deleteIngredient, deleteUnusedIngredients, type Ingredient } from '@/lib/supabase'
import { useNotification } from '@/hooks/useNotification'

type IngredientFormData = {
  name: string
  category: string
  url: string
}

export default function IngredientsAdminPage() {
  const { showSuccess, showError, showErrorModal, showConfirmModal, NotificationContainer } = useNotification()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null)
  const [formData, setFormData] = useState<IngredientFormData>({
    name: '',
    category: 'vegetables',
    url: '',
  })
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadIngredients()
  }, [])

  async function loadIngredients() {
    setLoading(true)
    const data = await getIngredients()
    setIngredients(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      name: '',
      category: 'vegetables',
      url: '',
    })
    setEditingIngredient(null)
    setShowForm(false)
  }

  function handleEdit(ingredient: Ingredient) {
    setEditingIngredient(ingredient)
    setFormData({
      name: ingredient.name,
      category: ingredient.category || 'vegetables',
      url: ingredient.url || '',
    })
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (editingIngredient) {
      const updated = await updateIngredient(editingIngredient.id, formData)
      if (!updated) {
        showErrorModal('Update Failed', 'There was an error updating the ingredient. Please try again.')
        return
      }
      showSuccess('Ingredient updated successfully')
    } else {
      const created = await createIngredient(formData.name, formData.category, formData.url)
      if (!created) {
        showErrorModal('Create Failed', 'There was an error creating the ingredient. Please try again.')
        return
      }
      showSuccess('Ingredient created successfully')
    }

    resetForm()
    loadIngredients()
  }

  async function handleDelete(id: number) {
    showConfirmModal(
      'Delete Ingredient',
      'Are you sure you want to delete this ingredient?',
      async () => {
        const success = await deleteIngredient(id)

        if (success) {
          showSuccess('Ingredient deleted successfully')
          await loadIngredients()
        } else {
          showErrorModal(
            'Delete Failed',
            'There was an error deleting the ingredient. Please try again.'
          )
        }
      },
      { variant: 'danger', confirmText: 'Delete' }
    )
  }

  async function handleDeleteUnused() {
    showConfirmModal(
      'Delete Unused Ingredients',
      'Are you sure you want to delete all ingredients that are not used in any recipes? This action cannot be undone.',
      async () => {
        const { success, count } = await deleteUnusedIngredients()

        if (success) {
          if (count > 0) {
            showSuccess(`Successfully deleted ${count} unused ingredient${count === 1 ? '' : 's'}`)
            await loadIngredients()
          } else {
            showSuccess('No unused ingredients found')
          }
        } else {
          showErrorModal(
            'Delete Failed',
            'There was an error deleting unused ingredients. Please try again.'
          )
        }
      },
      { variant: 'danger', confirmText: 'Delete Unused' }
    )
  }

  const categories = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'mushrooms', label: 'Mushrooms' },
    { value: 'nuts', label: 'Nuts & Seeds' },
    { value: 'pantry', label: 'Pantry' },
    { value: 'other', label: 'Other' },
  ]

  // Filter ingredients based on search query
  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ing.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <NotificationContainer />
      <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Manage Ingredients</h1>
          <p className="text-text-medium">Add, edit, and organize your foraging ingredients</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDeleteUnused}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Delete Unused
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Ingredient'}
          </button>
        </div>
      </div>

      {/* Ingredient Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-dark mb-6">
            {editingIngredient ? 'Edit Ingredient' : 'New Ingredient'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Wild Garlic, Chanterelles"
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
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">
                Purchase URL (optional)
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/buy-ingredient"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
              <p className="text-xs text-text-medium mt-1">
                Optional link where users can purchase this ingredient online
              </p>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingIngredient ? 'Update Ingredient' : 'Create Ingredient'}
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

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search ingredients by name or category..."
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
        />
      </div>

      {/* Ingredients List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-text-dark mb-4">
            All Ingredients ({filteredIngredients.length})
          </h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredIngredients.length === 0 ? (
            <p className="text-text-medium text-center py-8">
              {searchQuery ? 'No ingredients match your search.' : 'No ingredients yet. Create your first one!'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-text-dark">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-dark">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-text-dark">Purchase Link</th>
                    <th className="text-right py-3 px-4 font-semibold text-text-dark">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIngredients.map((ingredient) => (
                    <tr key={ingredient.id} className="border-b border-gray-100 hover:bg-bg-light transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-text-dark">{ingredient.name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded capitalize">
                          {ingredient.category || 'other'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {ingredient.url ? (
                          <a
                            href={ingredient.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary-dark text-sm underline"
                          >
                            View Link →
                          </a>
                        ) : (
                          <span className="text-text-medium text-sm">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleEdit(ingredient)}
                          className="text-primary hover:text-primary-dark font-medium px-3 py-1 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ingredient.id)}
                          className="text-red-600 hover:text-red-800 font-medium px-3 py-1"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
