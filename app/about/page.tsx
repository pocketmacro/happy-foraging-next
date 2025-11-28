export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom px-4">
          <h1 className="heading-1 text-white mb-4">About Happy Foraging</h1>
          <p className="text-xl max-w-2xl">
            Connecting people with nature through the ancient practice of foraging
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 mb-6">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-text-medium leading-relaxed mb-4">
                Happy Foraging was created to share the joy and knowledge of wild food foraging with everyone.
                We believe that reconnecting with nature through foraging can transform how we think about food,
                sustainability, and our relationship with the natural world.
              </p>
              <p className="text-lg text-text-medium leading-relaxed mb-4">
                Our platform provides comprehensive guides, tested recipes, and safety information to help both
                beginners and experienced foragers discover and enjoy wild foods responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section bg-bg-light-green">
        <div className="container-custom px-4">
          <h2 className="heading-2 text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="heading-3">Sustainability</h3>
              <p className="text-text-medium">
                We promote ethical foraging practices that preserve ecosystems and ensure wild foods remain
                available for future generations.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="heading-3">Education</h3>
              <p className="text-text-medium">
                Knowledge is key to safe foraging. We provide accurate, well-researched information to help
                foragers learn and grow.
              </p>
            </div>
            <div className="card p-8 text-center">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="heading-3">Community</h3>
              <p className="text-text-medium">
                Foraging is best shared. We foster a supportive community where foragers can learn from
                each other's experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="section">
        <div className="container-custom px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 mb-8">What We Offer</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-3xl">🔍</div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Comprehensive Guides</h3>
                  <p className="text-text-medium">
                    Detailed foraging guides covering plant identification, seasonal availability,
                    and sustainable harvesting practices.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">🍳</div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Tested Recipes</h3>
                  <p className="text-text-medium">
                    Delicious recipes featuring foraged ingredients, from simple salads to gourmet dishes.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Safety Information</h3>
                  <p className="text-text-medium">
                    Critical safety guidelines to help you forage confidently and avoid potentially
                    dangerous plants.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-3xl">🌍</div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">Regional Resources</h3>
                  <p className="text-text-medium">
                    Information tailored to different regions, helping you find edible plants in your area.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-dark text-white">
        <div className="container-custom px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join the Foraging Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your foraging journey today and discover the incredible world of wild foods
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/guides" className="btn-primary bg-white text-primary hover:bg-gray-100">
              Explore Guides
            </a>
            <a href="/recipes" className="btn-secondary border-white hover:bg-white/10">
              View Recipes
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
