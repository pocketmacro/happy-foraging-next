'use client'

import { useState, useEffect } from 'react'
import RecipeCard from '@/components/RecipeCard'
import { getRecipes, getIngredientsUsedInRecipes, getRecipesByIngredients, getRecipeCategories, type Recipe, type Ingredient } from '@/lib/supabase'

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showIngredients, setShowIngredients] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadIngredients()
    loadCategories()
  }, [])

  useEffect(() => {
    loadRecipes()
  }, [selectedCategory, selectedIngredients])

  async function loadIngredients() {
    const data = await getIngredientsUsedInRecipes()
    setAllIngredients(data)
  }

  async function loadCategories() {
    const data = await getRecipeCategories()
    setCategories(data)
  }

  async function loadRecipes() {
    setLoading(true)

    if (selectedIngredients.length > 0) {
      const data = await getRecipesByIngredients(selectedIngredients)
      setRecipes(data)
    } else {
      const data = await getRecipes(selectedCategory === 'all' ? undefined : selectedCategory)
      setRecipes(data)
    }

    setLoading(false)
  }

  function toggleIngredient(ingredientId: number) {
    setSelectedIngredients(prev =>
      prev.includes(ingredientId)
        ? prev.filter(id => id !== ingredientId)
        : [...prev, ingredientId]
    )
  }

  function clearIngredientFilter() {
    setSelectedIngredients([])
  }

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom px-4">
          <h1 className="heading-1 text-white mb-4">Wild Food Recipes</h1>
          <p className="text-xl max-w-2xl">
            Explore our collection of delicious recipes featuring foraged ingredients
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="section bg-bg-light">
        <div className="container-custom px-4">
          {/* Search Bar */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-6 py-3 rounded-full border-2 border-primary focus:outline-none focus:border-primary-dark"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-text-dark">Filter by Category</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-6 py-2 rounded-full font-semibold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-white text-primary hover:bg-primary-light hover:text-white'
                  }`}
                >
                  All Recipes
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all capitalize ${
                      selectedCategory === category
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-primary hover:bg-primary-light hover:text-white'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ingredient Filter */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-dark">Filter by Ingredients You Have</h3>
              <button
                onClick={() => setShowIngredients(!showIngredients)}
                className="text-primary hover:text-primary-dark font-medium text-sm"
              >
                {showIngredients ? 'Hide' : 'Show'} Ingredients {selectedIngredients.length > 0 && `(${selectedIngredients.length})`}
              </button>
            </div>

            {selectedIngredients.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {allIngredients
                  .filter(ing => selectedIngredients.includes(ing.id))
                  .map(ing => (
                    <button
                      key={ing.id}
                      onClick={() => toggleIngredient(ing.id)}
                      className="bg-primary text-white px-3 py-1 rounded-full text-sm flex items-center space-x-2 hover:bg-primary-dark"
                    >
                      <span>{ing.name}</span>
                      <span>✕</span>
                    </button>
                  ))}
                <button
                  onClick={clearIngredientFilter}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-400"
                >
                  Clear All
                </button>
              </div>
            )}

            {showIngredients && (
              <div className="bg-white rounded-lg p-4 shadow-md max-h-60 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allIngredients.map((ingredient) => (
                    <label
                      key={ingredient.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-bg-light-green p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(ingredient.id)}
                        onChange={() => toggleIngredient(ingredient.id)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-sm text-text-dark">{ingredient.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Recipe Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-text-medium">
                No recipes found. {searchTerm && 'Try a different search term.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
