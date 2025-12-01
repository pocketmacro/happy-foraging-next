export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom px-4">
          <h1 className="heading-1 text-white mb-4">About Happy Foraging</h1>
          <p className="text-xl max-w-2xl">
            Connecting people with fresh, local ingredients through farmers markets and community suppliers
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
                Happy Foraging was created to celebrate the joy of cooking with fresh, local ingredients from farmers markets
                and local suppliers. We believe that supporting local food producers can transform how we think about food,
                sustainability, and our connection to our community.
              </p>
              <p className="text-lg text-text-medium leading-relaxed mb-4">
                Our platform provides comprehensive guides, tested recipes, and tips to help you discover and prepare
                delicious meals using seasonal, locally-sourced ingredients.
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
              <h3 className="heading-3">Sustainability</h3>
              <p className="text-text-medium">
                We promote sustainable eating by supporting local farmers and reducing food miles,
                helping preserve our environment for future generations.
              </p>
            </div>
            <div className="card p-8 text-center">
              <h3 className="heading-3">Education</h3>
              <p className="text-text-medium">
                Knowledge is key to cooking well. We provide accurate, well-researched information about
                seasonal ingredients and cooking techniques.
              </p>
            </div>
            <div className="card p-8 text-center">
              <h3 className="heading-3">Community</h3>
              <p className="text-text-medium">
                Food brings people together. We foster a supportive community where home cooks can learn from
                each other's experiences and discover local suppliers.
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
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Seasonal Guides</h3>
                <p className="text-text-medium">
                  Detailed guides covering seasonal ingredients, what's available at farmers markets,
                  and how to select the best produce.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Tested Recipes</h3>
                <p className="text-text-medium">
                  Delicious recipes featuring fresh, local ingredients from farmers markets and local suppliers,
                  from simple weeknight meals to gourmet dishes.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Cooking Tips</h3>
                <p className="text-text-medium">
                  Essential cooking techniques and storage tips to help you make the most of fresh,
                  seasonal ingredients.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-primary mb-2">Local Resources</h3>
                <p className="text-text-medium">
                  Information about farmers markets and local suppliers in your area, helping you find
                  the best fresh ingredients near you.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-dark text-white">
        <div className="container-custom px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start cooking with local ingredients today and discover the incredible flavors of fresh, seasonal produce
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
