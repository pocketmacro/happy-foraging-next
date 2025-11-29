'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { getRecipes, createRecipe, updateRecipe, deleteRecipe, addRecipeIngredient, removeRecipeIngredient, updateRecipeIngredientsOrder, getRecipeImages, getIngredients, createIngredient, type Recipe, type Ingredient, type RecipeImage } from '@/lib/supabase'
import IngredientSearch from '@/components/admin/IngredientSearch'
import RecipeImagesSection from '@/components/admin/RecipeImagesSection'
import MarkdownEditor from '@/components/admin/MarkdownEditor'
import CategoryInput from '@/components/admin/CategoryInput'
import { generateSlug } from '@/lib/utils'
import { parseRecipeText } from '@/lib/recipeImporter'
import { useNotification } from '@/hooks/useNotification'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Sortable Ingredient Item Component
function SortableIngredientItem({
  ingredient,
  index,
  onRemove
}: {
  ingredient: RecipeIngredientData
  index: number
  onRemove: (index: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between bg-bg-light p-3 rounded"
    >
      <div className="flex items-center flex-1">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mr-3 text-gray-400 hover:text-gray-600"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"/>
          </svg>
        </div>
        <div className="flex-1">
          <span className="font-medium">{ingredient.ingredient.name}</span>
          {ingredient.quantity && <span className="text-text-medium"> - {ingredient.quantity}</span>}
          {ingredient.optional && <span className="text-xs bg-yellow-200 px-2 py-1 rounded ml-2">Optional</span>}
          {ingredient.notes && <p className="text-sm text-text-medium">{ingredient.notes}</p>}
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-600 hover:text-red-800 ml-4"
      >
        ✕
      </button>
    </div>
  )
}

type RecipeFormData = {
  title: string
  slug: string
  description: string
  category: string[]
  prep_time: number
  cook_time: number
  servings: number
  difficulty: string
  icon: string
  image: string
  instructions: string
  published: boolean
  featured: boolean
}

type RecipeIngredientData = {
  ingredient: Ingredient
  quantity: string
  optional: boolean
  notes: string
}

export default function RecipesAdminPage() {
  const { showSuccess, showError, showErrorModal, showConfirmModal, NotificationContainer } = useNotification()
  const searchParams = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(searchParams?.get('new') === 'true')
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    slug: '',
    description: '',
    category: [],
    prep_time: 15,
    cook_time: 0,
    servings: 4,
    difficulty: 'easy',
    icon: '🥗',
    image: '/images/recipes/veggie-bowl.jpg',
    instructions: '',
    published: true,
    featured: false,
  })
  const [ingredients, setIngredients] = useState<RecipeIngredientData[]>([])
  const [currentIngredient, setCurrentIngredient] = useState<{
    ingredient: Ingredient | null
    quantity: string
    optional: boolean
    notes: string
  }>({
    ingredient: null,
    quantity: '',
    optional: false,
    notes: '',
  })
  const [recipeImages, setRecipeImages] = useState<RecipeImage[]>([])
  const [showImportModal, setShowImportModal] = useState(false)
  const [importText, setImportText] = useState('')
  const [importTitle, setImportTitle] = useState('')
  const [importDescription, setImportDescription] = useState('')

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadRecipes()
  }, [])

  async function loadRecipes() {
    setLoading(true)
    const data = await getRecipes(undefined, true) // Include unpublished recipes in admin
    setRecipes(data)
    setLoading(false)
  }

  function resetForm() {
    setFormData({
      title: '',
      slug: '',
      description: '',
      category: [],
      prep_time: 15,
      cook_time: 0,
      servings: 4,
      difficulty: 'easy',
      icon: '🥗',
      image: '/images/recipes/veggie-bowl.jpg',
      instructions: '',
      published: true,
      featured: false,
    })
    setIngredients([])
    setRecipeImages([])
    setEditingRecipe(null)
    setShowForm(false)
  }

  async function loadRecipeImages(recipeId: number) {
    const images = await getRecipeImages(recipeId)
    setRecipeImages(images)
  }

  function handleEdit(recipe: Recipe) {
    setEditingRecipe(recipe)
    setFormData({
      title: recipe.title,
      slug: recipe.slug || generateSlug(recipe.title),
      description: recipe.description,
      category: recipe.category,
      prep_time: recipe.prep_time || 15,
      cook_time: recipe.cook_time || 0,
      servings: recipe.servings,
      difficulty: recipe.difficulty || 'easy',
      icon: recipe.icon || '🥗',
      image: recipe.image || '/images/recipes/veggie-bowl.jpg',
      instructions: recipe.instructions,
      published: recipe.published,
      featured: recipe.featured || false,
    })

    // Load existing ingredients
    if (recipe.recipe_ingredients) {
      const recipeIngredients = recipe.recipe_ingredients.map(ri => ({
        ingredient: ri.ingredient!,
        quantity: ri.quantity || '',
        optional: ri.optional,
        notes: ri.notes || '',
      }))
      setIngredients(recipeIngredients)
    }

    // Load existing images
    loadRecipeImages(recipe.id)

    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    let recipeId: number
    let savedRecipe: Recipe

    if (editingRecipe) {
      const updated = await updateRecipe(editingRecipe.id, formData)
      if (!updated) {
        showErrorModal('Update Failed', 'There was an error updating the recipe. Please try again.')
        return
      }
      recipeId = updated.id
      savedRecipe = updated

      // Remove all existing ingredients
      if (editingRecipe.recipe_ingredients) {
        for (const ri of editingRecipe.recipe_ingredients) {
          await removeRecipeIngredient(recipeId, ri.ingredient!.id)
        }
      }
      showSuccess('Recipe updated successfully')
    } else {
      const created = await createRecipe(formData)
      if (!created) {
        showErrorModal('Create Failed', 'There was an error creating the recipe. Please try again.')
        return
      }
      recipeId = created.id
      savedRecipe = created
      showSuccess('Recipe created successfully')
    }

    // Add all ingredients
    for (const ing of ingredients) {
      await addRecipeIngredient(
        recipeId,
        ing.ingredient.id,
        ing.quantity,
        ing.optional,
        ing.notes
      )
    }

    // If this was a new recipe, switch to edit mode so user can upload images
    if (!editingRecipe) {
      setEditingRecipe(savedRecipe)
      loadRecipeImages(recipeId)
      loadRecipes()
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      resetForm()
      loadRecipes()
    }
  }

  async function handleDelete(id: number) {
    showConfirmModal(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      async () => {
        const success = await deleteRecipe(id)
        if (success) {
          showSuccess('Recipe deleted successfully')
          loadRecipes()
        } else {
          showErrorModal('Delete Failed', 'There was an error deleting the recipe. Please try again.')
        }
      },
      { variant: 'danger', confirmText: 'Delete' }
    )
  }

  function addIngredient() {
    if (!currentIngredient.ingredient) return

    setIngredients([...ingredients, {
      ingredient: currentIngredient.ingredient,
      quantity: currentIngredient.quantity,
      optional: currentIngredient.optional,
      notes: currentIngredient.notes,
    }])

    setCurrentIngredient({
      ingredient: null,
      quantity: '',
      optional: false,
      notes: '',
    })
  }

  async function removeIngredient(index: number) {
    const ingredientToRemove = ingredients[index]

    // Remove from local state
    setIngredients(ingredients.filter((_, i) => i !== index))

    // If it's an existing ingredient (has ID) and we're editing a recipe, delete from database
    if (ingredientToRemove.id && editingRecipe) {
      await removeRecipeIngredient(editingRecipe.id, ingredientToRemove.ingredient.id)
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = ingredients.findIndex((_, i) => i === active.id)
      const newIndex = ingredients.findIndex((_, i) => i === over.id)

      const newIngredients = arrayMove(ingredients, oldIndex, newIndex)
      setIngredients(newIngredients)

      // If editing existing recipe, update display_order in database
      if (editingRecipe) {
        const updates = newIngredients.map((ing, index) => ({
          id: ing.id!,
          display_order: index
        })).filter(u => u.id) // Only update existing ingredients

        await updateRecipeIngredientsOrder(updates)
      }
    }
  }

  async function handleImport() {
    if (!importText.trim()) {
      showError('Please enter recipe text to import')
      return
    }

    if (!importTitle.trim()) {
      showError('Please enter a recipe title')
      return
    }

    const parsed = parseRecipeText(importText)

    // Get all existing ingredients to match against
    const existingIngredients = await getIngredients()
    const ingredientMap = new Map<string, Ingredient>()
    existingIngredients.forEach(ing => {
      ingredientMap.set(ing.name.toLowerCase(), ing)
    })

    // Process parsed ingredients - create new ones if needed
    const processedIngredients: RecipeIngredientData[] = []
    for (const parsedIng of parsed.ingredients) {
      const nameLower = parsedIng.name.toLowerCase()
      let ingredient = ingredientMap.get(nameLower)

      // If ingredient doesn't exist, create it
      if (!ingredient) {
        ingredient = await createIngredient(parsedIng.name, 'other')
        if (ingredient) {
          ingredientMap.set(nameLower, ingredient)
        }
      }

      if (ingredient) {
        processedIngredients.push({
          ingredient,
          quantity: parsedIng.quantity,
          optional: false,
          notes: parsedIng.notes,
        })
      }
    }

    // Set form data
    setFormData({
      ...formData,
      title: importTitle,
      slug: generateSlug(importTitle),
      instructions: parsed.instructions,
      description: importDescription || parsed.instructions.split('\n')[0].substring(0, 200) + '...',
    })
    setIngredients(processedIngredients)

    // Close modal and show form
    setShowImportModal(false)
    setImportText('')
    setImportTitle('')
    setImportDescription('')
    setShowForm(true)
    setEditingRecipe(null)
  }

  const categories = [
    { value: 'salads', label: 'Salads' },
    { value: 'soups', label: 'Soups' },
    { value: 'mains', label: 'Main Courses' },
    { value: 'sides', label: 'Sides' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'preserves', label: 'Preserves' },
  ]

  return (
    <>
      <NotificationContainer />
      <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-text-dark mb-2">Manage Recipes</h1>
          <p className="text-text-medium">Create and edit your foraging recipes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary"
          >
            📋 Quick Import
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Recipe'}
          </button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-dark">Quick Recipe Import</h2>
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportText('')
                    setImportTitle('')
                    setImportDescription('')
                  }}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="mb-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Recipe Title *</label>
                  <input
                    type="text"
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    placeholder="Enter recipe title..."
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Description (optional)</label>
                  <textarea
                    value={importDescription}
                    onChange={(e) => setImportDescription(e.target.value)}
                    placeholder="Brief description of the recipe..."
                    rows={2}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Recipe Text *</label>
                  <p className="text-text-medium text-sm mb-2">
                    Paste your recipe ingredients and instructions below. The parser will automatically detect sections.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm mb-2">
                    <p className="font-semibold text-blue-900 mb-1">Example format:</p>
                    <pre className="text-blue-800 text-xs whitespace-pre-wrap">
{`Ingredients
3 eggs
2 lbs zucchini
1 yellow onion
Salt

Instructions
Add olive oil to a pan. Cook onions for 2-3 minutes...`}
                    </pre>
                  </div>
                  <textarea
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                    placeholder="Paste your recipe text here..."
                    rows={12}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowImportModal(false)
                    setImportText('')
                    setImportTitle('')
                    setImportDescription('')
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  className="btn-primary"
                >
                  Import Recipe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-text-dark mb-6">
            {editingRecipe ? 'Edit Recipe' : 'New Recipe'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipe Images Section */}
            <RecipeImagesSection
              recipeId={editingRecipe?.id || null}
              images={recipeImages}
              onImagesChange={() => editingRecipe && loadRecipeImages(editingRecipe.id)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    const title = e.target.value
                    // Auto-generate slug from title when creating new recipe
                    if (!editingRecipe) {
                      setFormData({ ...formData, title, slug: generateSlug(title) })
                    } else {
                      setFormData({ ...formData, title })
                    }
                  }}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">
                  URL Slug
                  <span className="text-xs text-text-medium ml-2">(SEO-friendly URL)</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="auto-generated-from-title"
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <p className="text-xs text-text-medium mt-1">
                  URL will be: /recipes/{formData.slug || 'your-recipe-slug'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Categories</label>
              <CategoryInput
                categories={formData.category}
                onChange={(categories) => setFormData({ ...formData, category: categories })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Prep Time (min)</label>
                <input
                  type="number"
                  value={formData.prep_time}
                  onChange={(e) => setFormData({ ...formData, prep_time: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Cook Time (min)</label>
                <input
                  type="number"
                  value={formData.cook_time}
                  onChange={(e) => setFormData({ ...formData, cook_time: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Servings</label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-dark mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-2">Icon (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>

            {/* Ingredients Section */}
            <div className="border-t pt-6">
              <h3 className="text-xl font-bold text-text-dark mb-4">Ingredients</h3>

              {/* Current Ingredients List */}
              {ingredients.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-text-medium mb-2">Drag to reorder ingredients</p>
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={ingredients.map((_, index) => index)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-2">
                        {ingredients.map((ing, index) => (
                          <SortableIngredientItem
                            key={index}
                            ingredient={ing}
                            index={index}
                            onRemove={removeIngredient}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              {/* Add Ingredient Form */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-dark mb-2">Search Ingredient</label>
                  <IngredientSearch
                    onSelect={(ingredient) => setCurrentIngredient({ ...currentIngredient, ingredient })}
                    placeholder="Search or create ingredient..."
                  />
                  <div className="h-6 mt-1">
                    {currentIngredient.ingredient && (
                      <p className="text-sm text-primary">Selected: {currentIngredient.ingredient.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Quantity</label>
                  <input
                    type="text"
                    value={currentIngredient.quantity}
                    onChange={(e) => setCurrentIngredient({ ...currentIngredient, quantity: e.target.value })}
                    placeholder="2 cups"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <div className="h-6 mt-1"></div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-dark mb-2">Notes</label>
                  <input
                    type="text"
                    value={currentIngredient.notes}
                    onChange={(e) => setCurrentIngredient({ ...currentIngredient, notes: e.target.value })}
                    placeholder="chopped"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <div className="h-6 mt-1"></div>
                </div>

                <div>
                  <div className="h-6 mb-2"></div>
                  <div className="flex items-center space-x-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={currentIngredient.optional}
                        onChange={(e) => setCurrentIngredient({ ...currentIngredient, optional: e.target.checked })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Optional</span>
                    </label>
                    <button
                      type="button"
                      onClick={addIngredient}
                      disabled={!currentIngredient.ingredient}
                      className="btn-primary px-4 py-2 disabled:opacity-50"
                    >
                      + Add
                    </button>
                  </div>
                  <div className="h-6 mt-1"></div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <MarkdownEditor
              label="Instructions"
              value={formData.instructions}
              onChange={(value) => setFormData({ ...formData, instructions: value })}
              placeholder="Write recipe instructions here. You can use Markdown formatting:

**Example:**
1. Preheat oven to 350°F
2. Mix ingredients in a large bowl
3. Pour into baking dish
4. Bake for 30 minutes

Use **bold** for emphasis, *italic* for notes, and `code` for measurements."
              height={400}
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
                Publish recipe (visible to public)
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4"
              />
              <label htmlFor="featured" className="text-sm font-medium text-text-dark">
                Featured recipe (show on homepage)
              </label>
            </div>

            <div className="flex space-x-4">
              <button type="submit" className="btn-primary">
                {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
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

      {/* Recipes List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-text-dark mb-4">All Recipes</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recipes.length === 0 ? (
            <p className="text-text-medium text-center py-8">No recipes yet. Create your first one!</p>
          ) : (
            <div className="space-y-4">
              {recipes.map((recipe) => (
                <div key={recipe.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{recipe.icon}</span>
                        <h3 className="text-lg font-bold text-text-dark">{recipe.title}</h3>
                        {!recipe.published && (
                          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">Draft</span>
                        )}
                        {recipe.featured && (
                          <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">⭐ Featured</span>
                        )}
                      </div>
                      <p className="text-text-medium text-sm mb-2">{recipe.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-text-medium">
                        {recipe.category && recipe.category.map((cat, idx) => (
                          <span key={idx} className="bg-primary/10 px-2 py-1 rounded capitalize">{cat}</span>
                        ))}
                        <span>⏱️ {recipe.prep_time}min prep</span>
                        {recipe.cook_time && recipe.cook_time > 0 && <span>🔥 {recipe.cook_time}min cook</span>}
                        <span>👥 {recipe.servings} servings</span>
                        {recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0 && (
                          <span>🥬 {recipe.recipe_ingredients.length} ingredients</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(recipe)}
                        className="text-primary hover:text-primary-dark font-medium px-3 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
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
    </>
  )
}
