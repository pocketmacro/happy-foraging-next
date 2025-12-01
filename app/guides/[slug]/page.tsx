import Image from 'next/image'
import Link from 'next/link'
import { getGuideBySlug, getGuideById, getGuideImages } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import MarkdownPreview from '@/components/MarkdownPreview'

export default async function GuidePage({ params }: { params: { slug: string } }) {
  // Try to get guide by slug first, fallback to ID for backwards compatibility
  let guide = await getGuideBySlug(params.slug)

  // If not found by slug, try as ID (backwards compatibility)
  if (!guide && !isNaN(Number(params.slug))) {
    guide = await getGuideById(parseInt(params.slug))
  }

  if (!guide) {
    notFound()
  }

  // Fetch guide images
  const guideImages = await getGuideImages(guide.id)

  // Get primary image or fallback
  const primaryImage = guideImages.find(img => img.is_primary)
  const headerImageUrl = primaryImage?.public_url
  const headerImageAlt = primaryImage?.alt_text || guide.title

  // Get gallery images (non-primary images)
  const galleryImages = guideImages.filter(img => !img.is_primary).sort((a, b) => a.display_order - b.display_order)

  return (
    <>
      {/* Guide Header */}
      <section className="relative h-[400px] overflow-hidden">
        {headerImageUrl ? (
          <>
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
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark"></div>
        )}
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="container-custom">
            <Link
              href="/guides"
              className="inline-block mb-4 text-secondary-light hover:text-white transition-colors"
            >
              ← Back to Guides
            </Link>
            <div className="flex items-center gap-3 mb-2">
              {guide.category && (
                <span className="bg-primary px-4 py-1 rounded-full text-sm font-semibold capitalize">
                  {guide.category}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">{guide.title}</h1>
          </div>
        </div>
      </section>

      {/* Guide Content */}
      <section className="section">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <p className="text-lg text-text-medium leading-relaxed">{guide.description}</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <MarkdownPreview content={guide.content} />
            </div>

            {/* Image Gallery */}
            {galleryImages.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-text-dark mb-4">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {galleryImages.map((image) => (
                    <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden group">
                      <Image
                        src={image.public_url}
                        alt={image.alt_text || guide.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guide.tags && guide.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-text-medium mb-3">TAGS</h3>
                <div className="flex flex-wrap gap-2">
                  {guide.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Safety Reminder */}
      <section className="section bg-accent-yellow/10">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">⚠️</span>
              <h2 className="text-2xl font-bold text-text-dark">Safety Reminder</h2>
            </div>
            <p className="text-text-dark">
              Always exercise caution when foraging. Never consume anything you cannot positively identify.
              When in doubt, consult with experienced foragers or experts in your area.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
