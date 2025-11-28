'use client'

import ImageUpload from './ImageUpload'
import type { RecipeImage } from '@/lib/supabase'

interface RecipeImagesSectionProps {
  recipeId: number | null
  images: RecipeImage[]
  onImagesChange: () => void
}

export default function RecipeImagesSection({ recipeId, images, onImagesChange }: RecipeImagesSectionProps) {
  if (!recipeId) {
    return (
      <div className="border-t-2 border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-text-dark mb-4">Recipe Images</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Save the recipe first, then you can upload images.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t-2 border-gray-200 pt-6">
      <h3 className="text-xl font-bold text-text-dark mb-4">Recipe Images</h3>
      <ImageUpload
        recipeId={recipeId}
        images={images}
        onImagesChange={onImagesChange}
      />
    </div>
  )
}
