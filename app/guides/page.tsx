'use client'

import { useState, useEffect } from 'react'
import GuideCard from '@/components/GuideCard'
import { getGuides, type Guide } from '@/lib/supabase'

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGuides()
  }, [])

  async function loadGuides() {
    setLoading(true)
    const data = await getGuides()
    setGuides(data)
    setLoading(false)
  }

  const safetyTips = [
    'Choose produce that is in season for best flavor and value',
    'Look for bright colors and firm textures',
    'Get to know your local farmers and suppliers',
    'Check farmers market schedules in your area',
    'Store fresh produce properly to maximize freshness',
    'Buy only what you need to reduce food waste',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-dark text-white py-16">
        <div className="container-custom px-4">
          <h1 className="heading-1 text-white mb-4">Seasonal Guides</h1>
          <p className="text-xl max-w-2xl">
            Learn to select, prepare, and preserve fresh, local ingredients with our comprehensive seasonal guides
          </p>
        </div>
      </section>

      {/* Tips Section */}
      <section className="section bg-accent-yellow/10">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="heading-2">Shopping Tips</h2>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <p className="text-lg text-text-dark mb-6">
                Getting the most from farmers markets and local suppliers is easy when you follow these helpful tips:
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 text-xl">✓</span>
                    <span className="text-text-dark">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="section">
        <div className="container-custom px-4">
          <h2 className="heading-2 text-center mb-12">Explore Our Guides</h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <GuideCard key={guide.id} guide={guide} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-text-medium">
                No guides available yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Resources Section */}
      <section className="section bg-bg-light-green">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-2 mb-6">Additional Resources</h2>
            <p className="text-lg text-text-medium mb-8">
              We recommend joining local foraging groups, attending workshops, and consulting field guides specific to your region.
              Always cross-reference multiple sources when identifying plants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Download Field Guide
              </button>
              <button className="btn-secondary">
                Find Local Groups
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
