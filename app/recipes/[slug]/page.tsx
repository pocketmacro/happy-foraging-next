import Image from 'next/image'
import Link from 'next/link'
import { getRecipeBySlug, getRecipeById } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import MarkdownPreview from '@/components/MarkdownPreview'

export default async function RecipePage({ params }: { params: { slug: string } }) {
  // Try to get recipe by slug first, fallback to ID for backwards compatibility
  let recipe = await getRecipeBySlug(params.slug)

  // If not found by slug, try as ID (backwards compatibility)
  if (!recipe && !isNaN(Number(params.slug))) {
    recipe = await getRecipeById(parseInt(params.slug))
  }

  if (!recipe) {
    notFound()
  }

  // Get primary image or fallback
  const primaryImage = recipe.recipe_images?.find(img => img.is_primary)
  const headerImageUrl = primaryImage?.public_url || recipe.image || '/images/recipes/veggie-bowl.jpg'
  const headerImageAlt = primaryImage?.alt_text || recipe.title

  // Get gallery images (non-primary images)
  const galleryImages = recipe.recipe_images?.filter(img => !img.is_primary).sort((a, b) => a.display_order - b.display_order) || []

  return (
    <>
      {/* Recipe Header */}
      <section className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0" style={{ transform: 'translateZ(0)' }}>
          <Image
            src={headerImageUrl}
            alt={headerImageAlt}
            fill
            className="object-cover"
            priority
            style={{ transform: 'scale(1.1)' }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="container-custom">
            <Link
              href="/recipes"
              className="inline-block mb-4 text-secondary-light hover:text-white transition-colors"
            >
              ← Back to Recipes
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">{recipe.icon}</span>
              <span className="bg-accent-orange px-4 py-1 rounded-full text-sm font-semibold">
                {recipe.prep_time} min
              </span>
              {recipe.category && recipe.category.map((cat, idx) => (
                <span key={idx} className="bg-primary px-4 py-1 rounded-full text-sm font-semibold capitalize">
                  {cat}
                </span>
              ))}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{recipe.title}</h1>
          </div>
        </div>
      </section>

      {/* Recipe Content */}
      <section className="section">
        <div className="container-custom px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h2 className="heading-2 mb-4">Description</h2>
                <p className="text-lg text-text-medium leading-relaxed">{recipe.description}</p>
              </div>

              <div className="mb-8">
                <h2 className="heading-2 mb-4">Ingredients</h2>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <ul className="space-y-4">
                    {recipe.recipe_ingredients?.sort((a, b) => a.display_order - b.display_order).map((ri) => (
                      <li key={ri.id} className="flex items-start pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                        <span className="text-primary mr-3 mt-1 text-xl">•</span>
                        <div className="flex-1">
                          <div className="flex items-baseline flex-wrap gap-2">
                            {ri.quantity && (
                              <span className="font-bold text-primary text-lg">{ri.quantity}</span>
                            )}
                            <span className="text-text-dark text-lg font-medium">{ri.ingredient?.name}</span>
                            {ri.optional && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold">Optional</span>
                            )}
                          </div>
                          {ri.notes && (
                            <p className="text-sm text-text-medium italic mt-1 ml-0.5">{ri.notes}</p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="heading-2 mb-4">Instructions</h2>
                <MarkdownPreview content={recipe.instructions} />
              </div>

              {/* Image Gallery */}
              {galleryImages.length > 0 && (
                <div>
                  <h2 className="heading-2 mb-4">Photos</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image) => (
                      <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group">
                        <Image
                          src={image.public_url}
                          alt={image.alt_text || recipe.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="heading-3 mb-4">Recipe Info</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-text-medium mb-1">Preparation Time</p>
                    <p className="text-lg font-semibold text-primary">{recipe.prep_time} minutes</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-medium mb-1">Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {recipe.category && recipe.category.map((cat, idx) => (
                        <span key={idx} className="text-sm font-semibold text-primary capitalize bg-primary/10 px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-medium mb-1">Servings</p>
                    <p className="text-lg font-semibold text-primary">4 people</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold mb-3">Share this recipe</h4>
                  <div className="flex gap-3">
                    <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded transition-colors">
                      Share
                    </button>
                    <button className="flex-1 bg-white hover:bg-bg-light text-primary border-2 border-primary py-2 px-4 rounded transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
