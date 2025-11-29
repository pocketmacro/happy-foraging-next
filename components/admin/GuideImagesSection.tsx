'use client'

import GuideImageUpload from './GuideImageUpload'
import { type GuideImage } from '@/lib/supabase'

interface GuideImagesSectionProps {
  guideId: number | null
  images: GuideImage[]
  onImagesChange: () => void
}

export default function GuideImagesSection({ guideId, images, onImagesChange }: GuideImagesSectionProps) {
  if (!guideId) {
    return (
      <div className="border-t-2 border-gray-200 pt-6">
        <h3 className="text-xl font-bold text-text-dark mb-4">Guide Images</h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Save the guide first, then you can upload images.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t-2 border-gray-200 pt-6">
      <h3 className="text-xl font-bold text-text-dark mb-4">Guide Images</h3>
      <GuideImageUpload
        guideId={guideId}
        images={images}
        onImagesChange={onImagesChange}
      />
    </div>
  )
}
