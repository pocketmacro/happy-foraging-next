import Image from 'next/image'
import Link from 'next/link'
import { getFeaturedRecipes } from '@/lib/supabase'

export default async function Home() {
  const features = [
    {
      icon: '🌿',
      title: 'Expert Guides',
      description: 'Learn from experienced foragers with detailed identification guides and safety tips.',
    },
    {
      icon: '🍄',
      title: 'Wild Recipes',
      description: 'Transform your foraged finds into delicious meals with our tested recipes.',
    },
    {
      icon: '🌍',
      title: 'Sustainable',
      description: 'Practice ethical foraging that respects nature and preserves ecosystems.',
    },
  ]

  // Fetch featured recipes from database
  const featuredRecipes = await getFeaturedRecipes()

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/backgrounds/hero-1.jpg"
            alt="Foraging in nature"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary-dark/90" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Welcome to Happy Foraging
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed">
            Discover the art of foraging and transform wild ingredients into delicious, sustainable meals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/recipes" className="btn-primary">
              Explore Recipes
            </Link>
            <Link href="/guides" className="btn-secondary bg-white/90 hover:bg-white">
              Foraging Guides
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-bg-light-green">
        <div className="container-custom">
          <h2 className="heading-2 text-center mb-12">Why Choose Happy Foraging?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-8 text-center">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="heading-3">{feature.title}</h3>
                <p className="text-text-medium leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Recipes Section */}
      <section className="section">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <h2 className="heading-2">Featured Recipes</h2>
            <Link href="/recipes" className="text-primary hover:text-primary-dark font-semibold">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRecipes.map((recipe) => {
              // Use slug if available, fallback to ID
              const recipeUrl = recipe.slug ? `/recipes/${recipe.slug}` : `/recipes/${recipe.id}`

              // Get primary image or fallback to recipe.image
              const primaryImage = recipe.recipe_images?.find(img => img.is_primary)
              const imageUrl = primaryImage?.public_url || recipe.image || '/images/recipes/veggie-bowl.jpg'
              const imageAlt = primaryImage?.alt_text || recipe.title

              return (
                <Link key={recipe.id} href={recipeUrl} className="card group">
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
                    {recipe.icon && (
                      <div className="absolute top-4 left-4 text-4xl">
                        {recipe.icon}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {recipe.category && recipe.category.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="text-primary text-xs font-semibold capitalize bg-primary/10 px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-xl font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">{recipe.title}</h3>
                    <p className="text-text-medium text-sm line-clamp-2">{recipe.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section bg-primary text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Foraging Journey Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community and learn how to safely identify, harvest, and prepare wild foods
          </p>
          <Link href="/guides" className="btn-secondary border-white hover:bg-white/10">
            Get Started
          </Link>
        </div>
      </section>
    </>
  )
}
