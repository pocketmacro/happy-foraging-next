'use client'

import { useState, useRef, useEffect } from 'react'

interface CategoryInputProps {
  categories: string[]
  onChange: (categories: string[]) => void
  suggestions?: string[]
}

const DEFAULT_SUGGESTIONS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Salads',
  'Soups',
  'Mains',
  'Sides',
  'Desserts',
  'Snacks',
  'Beverages',
  'Preserves',
  'Appetizers',
]

export default function CategoryInput({ categories, onChange, suggestions = DEFAULT_SUGGESTIONS }: CategoryInputProps) {
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (input.trim()) {
      // Filter suggestions based on input, excluding already selected categories
      const filtered = suggestions.filter(
        s =>
          s.toLowerCase().includes(input.toLowerCase()) &&
          !categories.some(c => c.toLowerCase() === s.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [input, suggestions, categories])

  function addCategory(category: string) {
    const trimmed = category.trim()
    if (!trimmed) return

    // Check if category already exists (case insensitive)
    const exists = categories.some(c => c.toLowerCase() === trimmed.toLowerCase())
    if (exists) {
      setInput('')
      setShowSuggestions(false)
      return
    }

    // Add the category
    onChange([...categories, trimmed])
    setInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  function removeCategory(index: number) {
    onChange(categories.filter((_, i) => i !== index))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addCategory(input)
    } else if (e.key === 'Backspace' && !input && categories.length > 0) {
      // Remove last category if backspace on empty input
      removeCategory(categories.length - 1)
    }
  }

  function handleSuggestionClick(suggestion: string) {
    addCategory(suggestion)
  }

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 p-2 border-2 border-gray-300 rounded-lg focus-within:border-primary min-h-[48px] bg-white">
        {/* Display selected categories as tags */}
        {categories.map((category, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
          >
            {category}
            <button
              type="button"
              onClick={() => removeCategory(index)}
              className="hover:text-primary-dark"
            >
              ×
            </button>
          </span>
        ))}

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => input && setShowSuggestions(true)}
          onBlur={() => {
            // Delay to allow clicking suggestions
            setTimeout(() => setShowSuggestions(false), 200)
          }}
          placeholder={categories.length === 0 ? 'Add categories (press Enter or comma)' : 'Add more...'}
          className="flex-1 outline-none min-w-[150px] px-2 py-1"
        />
      </div>

      {/* Autocomplete suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-primary/10 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-text-medium mt-1">
        Type and press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">Enter</kbd> or <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">,</kbd> to add categories
      </p>
    </div>
  )
}
