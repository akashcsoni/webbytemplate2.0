export default function AboutUsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="space-y-12">
          {/* Hero Section */}
          <section className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Our Company</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              We are dedicated to delivering excellence in everything we do. Our commitment to quality
              and innovation drives us forward in creating solutions that make a difference.
            </p>
          </section>

          {/* Story Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Founded with a vision to transform the industry, we've grown from a small startup to a
              thriving organization. Our journey is marked by continuous innovation, customer satisfaction,
              and a commitment to excellence.
            </p>
          </section>

          {/* Mission Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              To empower businesses and individuals with cutting-edge solutions that drive growth,
              efficiency, and success in the digital age. We believe in making technology accessible
              and beneficial for everyone.
            </p>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We constantly push boundaries and embrace new technologies to stay ahead of the curve.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Quality</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We maintain the highest standards in our products, services, and customer interactions.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-3">Integrity</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We operate with transparency and honesty, building trust with our clients and partners.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Leadership</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our experienced leadership team brings together diverse expertise and vision to guide
                  our company's growth and success.
                </p>
              </div>
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Experts</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our team of skilled professionals is dedicated to delivering exceptional results
                  and innovative solutions to our clients.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 