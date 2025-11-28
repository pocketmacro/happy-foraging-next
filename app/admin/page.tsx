'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRecipes, getGuides, getIngredients } from '@/lib/supabase'

export default function AdminDashboard() {
  const [recipeCount, setRecipeCount] = useState(0)
  const [guideCount, setGuideCount] = useState(0)
  const [ingredientCount, setIngredientCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      setLoading(true)
      const [recipes, guides, ingredients] = await Promise.all([
        getRecipes(undefined, true), // Include unpublished in admin
        getGuides(),
        getIngredients()
      ])
      setRecipeCount(recipes.length)
      setGuideCount(guides.length)
      setIngredientCount(ingredients.length)
      setLoading(false)
    }
    loadStats()
  }, [])

  const stats = [
    { label: 'Total Recipes', value: loading ? '...' : recipeCount.toString(), icon: '🍽️', href: '/admin/recipes' },
    { label: 'Total Guides', value: loading ? '...' : guideCount.toString(), icon: '📚', href: '/admin/guides' },
    { label: 'Ingredients', value: loading ? '...' : ingredientCount.toString(), icon: '🥬', href: '/admin/recipes' },
  ]

  const quickActions = [
    { label: 'Add New Recipe', href: '/admin/recipes?new=true', icon: '➕', color: 'bg-primary' },
    { label: 'Add New Guide', href: '/admin/guides?new=true', icon: '➕', color: 'bg-primary-dark' },
    { label: 'View Site', href: '/', icon: '🌐', color: 'bg-accent-orange' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Admin Dashboard</h1>
        <p className="text-text-medium">Manage your recipes, guides, and content</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-medium text-sm mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-primary-dark">{stat.value}</p>
              </div>
              <div className="text-5xl">{stat.icon}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-text-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-semibold">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
