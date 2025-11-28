'use client'

import { useState, useEffect, useRef } from 'react'
import { searchIngredients, getOrCreateIngredient, type Ingredient } from '@/lib/supabase'

interface IngredientSearchProps {
  onSelect: (ingredient: Ingredient) => void
  placeholder?: string
}

export default function IngredientSearch({ onSelect, placeholder = 'Search ingredients...' }: IngredientSearchProps) {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<Ingredient[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function performSearch() {
      if (search.length < 2) {
        setResults([])
        return
      }

      const ingredients = await searchIngredients(search)
      setResults(ingredients)
      setIsOpen(true)
    }

    const timer = setTimeout(performSearch, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleCreateNew() {
    if (!search.trim()) return

    setIsCreating(true)
    const ingredient = await getOrCreateIngredient(search.trim())

    if (ingredient) {
      onSelect(ingredient)
      setSearch('')
      setIsOpen(false)
    }

    setIsCreating(false)
  }

  function handleSelect(ingredient: Ingredient) {
    onSelect(ingredient)
    setSearch('')
    setIsOpen(false)
  }

  const noExactMatch = search.length >= 2 && !results.some(r => r.name.toLowerCase() === search.toLowerCase())

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
      />

      {isOpen && (search.length >= 2) && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((ingredient) => (
                <li key={ingredient.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(ingredient)}
                    className="w-full text-left px-4 py-2 hover:bg-bg-light-green transition-colors"
                  >
                    <div className="font-medium text-text-dark">{ingredient.name}</div>
                    {ingredient.category && (
                      <div className="text-xs text-text-medium capitalize">{ingredient.category}</div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {noExactMatch && (
            <div className="border-t border-gray-200 p-2">
              <button
                type="button"
                onClick={handleCreateNew}
                disabled={isCreating}
                className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : `+ Create "${search}"`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
