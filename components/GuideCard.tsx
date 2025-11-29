import Image from 'next/image'
import Link from 'next/link'
import type { Guide } from '@/lib/supabase'

interface GuideCardProps {
  guide: Guide
}

export default function GuideCard({ guide }: GuideCardProps) {
  // Use slug if available, fallback to ID
  const guideUrl = guide.slug ? `/guides/${guide.slug}` : `/guides/${guide.id}`

  // Get primary image from guide_images
  const primaryImage = guide.guide_images?.find(img => img.is_primary)

  return (
    <Link href={guideUrl} className="card group">
      <div className="relative h-64">
        {primaryImage ? (
          <Image
            src={primaryImage.public_url}
            alt={primaryImage.alt_text || guide.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <span className="text-8xl">{guide.icon || '🌿'}</span>
          </div>
        )}
        {guide.category && (
          <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold capitalize">
            {guide.category}
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-text-dark mb-2 group-hover:text-primary transition-colors">
          {guide.icon && <span className="mr-2">{guide.icon}</span>}
          {guide.title}
        </h3>
        <p className="text-text-medium text-sm line-clamp-3">{guide.description}</p>
      </div>
    </Link>
  )
}
