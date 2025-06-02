const About = () => {
  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">About Us</h1>
        
        {/* Company Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Welcome to our e-commerce platform, where we strive to provide the best shopping experience
            for our customers. Founded in 2024, we've been committed to offering high-quality products
            at competitive prices.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our mission is to make online shopping simple, secure, and enjoyable for everyone.
            We carefully curate our product selection to ensure that we only offer items that meet
            our high standards of quality and value.
          </p>
        </section>

        {/* Values Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Quality</h3>
              <p className="text-gray-600">We never compromise on the quality of our products.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer First</h3>
              <p className="text-gray-600">Your satisfaction is our top priority.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
              <p className="text-gray-600">We continuously improve our services and offerings.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About; 