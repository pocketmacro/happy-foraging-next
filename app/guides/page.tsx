import Image from 'next/image'

export default function GuidesPage() {
  const guides = [
    {
      id: 1,
      title: 'Getting Started with Foraging',
      description: 'Learn the basics of safe and sustainable foraging practices.',
      icon: '🌿',
      topics: ['Safety guidelines', 'Best seasons', 'Essential tools', 'Legal considerations'],
    },
    {
      id: 2,
      title: 'Identifying Edible Plants',
      description: 'Master the art of plant identification to forage safely.',
      icon: '🔍',
      topics: ['Visual identification', 'Common lookalikes', 'Seasonal changes', 'Regional variations'],
    },
    {
      id: 3,
      title: 'Mushroom Foraging Safety',
      description: 'Critical information for safe mushroom foraging.',
      icon: '🍄',
      topics: ['Poisonous varieties', 'Identification tips', 'Spore prints', 'Expert verification'],
    },
    {
      id: 4,
      title: 'Sustainable Harvesting',
      description: 'Ethical practices to preserve nature for future generations.',
      icon: '♻️',
      topics: ['Leave no trace', 'Harvest limits', 'Ecosystem impact', 'Propagation'],
    },
    {
      id: 5,
      title: 'Foraging by Season',
      description: 'Discover what to forage throughout the year.',
      icon: '📅',
      topics: ['Spring greens', 'Summer berries', 'Fall mushrooms', 'Winter finds'],
    },
    {
      id: 6,
      title: 'Storage and Preservation',
      description: 'Keep your foraged foods fresh and delicious.',
      icon: '🏺',
      topics: ['Drying methods', 'Freezing tips', 'Pickling', 'Making preserves'],
    },
  ]

  const safetyTips = [
    'Never eat anything you cannot positively identify',
    'Start with easily identifiable plants',
    'Learn from experienced foragers',
    'Check local regulations before foraging',
    'Forage away from polluted areas',
    'Harvest sustainably - take only what you need',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary-dark text-white py-16">
        <div className="container-custom px-4">
          <h1 className="heading-1 text-white mb-4">Foraging Guides</h1>
          <p className="text-xl max-w-2xl">
            Learn to safely identify, harvest, and preserve wild foods with our comprehensive guides
          </p>
        </div>
      </section>

      {/* Safety First Section */}
      <section className="section bg-accent-yellow/10">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">⚠️</span>
              <h2 className="heading-2">Safety First</h2>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-md">
              <p className="text-lg text-text-dark mb-6">
                Foraging can be rewarding, but safety must always come first. Follow these essential guidelines:
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div key={guide.id} className="card p-6">
                <div className="text-5xl mb-4">{guide.icon}</div>
                <h3 className="heading-3">{guide.title}</h3>
                <p className="text-text-medium mb-4">{guide.description}</p>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm font-semibold text-primary mb-2">Topics covered:</p>
                  <ul className="space-y-1">
                    {guide.topics.map((topic, index) => (
                      <li key={index} className="text-sm text-text-medium flex items-start">
                        <span className="text-primary mr-2">•</span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
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
