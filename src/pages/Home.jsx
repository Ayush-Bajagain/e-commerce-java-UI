import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { ShoppingBag, Star, Truck, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products
        const productsResponse = await axios.get(`${API_BASE_URL}/products/featured`);
        if (productsResponse.data.httpStatus === 'OK') {
          setFeaturedProducts(productsResponse.data.data);
        }

        // Fetch categories
        const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
        if (categoriesResponse.data.httpStatus === 'OK') {
          setCategories(categoriesResponse.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    const cleanUrl = imageUrl.startsWith('uploads/') ? imageUrl.substring(8) : imageUrl;
    return `${API_BASE_URL.replace('/api/v1', '')}/${cleanUrl}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-6">
                Discover Quality Products at Amazing Prices
              </h1>
              <p className="text-xl mb-8">
                Shop the latest trends and find your perfect style with our curated collection of premium products.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
            <div className="p-3 bg-primary-100 rounded-full">
              <Truck className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Free Shipping</h3>
              <p className="text-gray-600">On orders over $100</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
            <div className="p-3 bg-primary-100 rounded-full">
              <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Secure Payment</h3>
              <p className="text-gray-600">100% secure checkout</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-6 bg-white rounded-lg shadow-sm">
            <div className="p-3 bg-primary-100 rounded-full">
              <Star className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quality Products</h3>
              <p className="text-gray-600">Guaranteed quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <Link
            to="/products"
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
          >
            View All
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="relative aspect-square">
                <img
                  src={formatImageUrl(product.imageUrl)}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                <p className="text-primary-600 font-semibold">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.id}`}
              className="group relative aspect-square rounded-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-semibold group-hover:scale-110 transition-transform duration-200">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="container mx-auto px-4">
        <div className="bg-primary-600 rounded-2xl p-8 md:p-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Special Offer: Get 20% Off
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Limited time offer on selected items. Use code WELCOME20 at checkout.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
            >
              Shop Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 