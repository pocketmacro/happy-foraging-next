export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom px-4">
          <h1 className="heading-1 text-white mb-4">About Happy Foraging</h1>
          <p className="text-xl max-w-2xl">
            We're all about bringing people together through the love of fresh, local ingredients and the vibrant community of farmers markets!
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
                Happy Foraging started with a simple passion: celebrating the incredible flavors and connections that come from
                cooking with fresh, local ingredients! We believe that every trip to the farmers market is an adventure, and
                every meal made with seasonal produce is a chance to support amazing local growers while treating yourself to
                the best food possible.
              </p>
              <p className="text-lg text-text-medium leading-relaxed mb-4">
                Our platform is packed with inspiring guides, tried-and-true recipes, and helpful tips to make your journey
                with local ingredients easy, fun, and absolutely delicious!
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
                We're passionate about eating sustainably! By supporting local farmers and choosing seasonal produce,
                you're making a positive impact on the environment while enjoying the freshest food around.
              </p>
            </div>
            <div className="card p-8 text-center">
              <h3 className="heading-3">Education</h3>
              <p className="text-text-medium">
                Learning is fun when it's delicious! We share easy-to-understand tips and techniques that help you
                get the most flavor and nutrition from seasonal, local ingredients.
              </p>
            </div>
            <div className="card p-8 text-center">
              <h3 className="heading-3">Community</h3>
              <p className="text-text-medium">
                Food is better when shared! Join our friendly community where home cooks swap stories, share
                discoveries, and celebrate amazing local farmers and suppliers together.
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
          <h2 className="text-3xl font-bold mb-6">Come Join the Fun!</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Ready to discover the incredible flavors waiting for you at your local farmers market? Let's get cooking!
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
