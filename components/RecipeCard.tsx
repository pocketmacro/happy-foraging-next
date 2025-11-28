import Image from 'next/image'
import Link from 'next/link'
import type { Recipe } from '@/lib/supabase'

interface RecipeCardProps {
  recipe: Recipe
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  // Use slug if available, fallback to ID
  const recipeUrl = recipe.slug ? `/recipes/${recipe.slug}` : `/recipes/${recipe.id}`

  // Get primary image or fallback to recipe.image
  const primaryImage = recipe.recipe_images?.find(img => img.is_primary)
  const imageUrl = primaryImage?.public_url || recipe.image || '/images/recipes/veggie-bowl.jpg'
  const imageAlt = primaryImage?.alt_text || recipe.title

  return (
    <Link href={recipeUrl} className="card group">
      <div className="relative h-64">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-accent-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
          {recipe.prep_time} min
        </div>
        <div className="absolute top-4 left-4 text-4xl">
          {recipe.icon}
        </div>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-1 mb-2">
          {recipe.category && recipe.category.slice(0, 2).map((cat, idx) => (
            <span key={idx} className="text-primary text-xs font-semibold capitalize bg-primary/10 px-2 py-1 rounded">
              {cat}
            </span>
          ))}
          {recipe.category && recipe.category.length > 2 && (
            <span className="text-xs text-gray-500">+{recipe.category.length - 2}</span>
          )}
        </div>
        <h3 className="text-xl font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>
        <p className="text-text-medium text-sm line-clamp-2">{recipe.description}</p>
      </div>
    </Link>
  )
}
