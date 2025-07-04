import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getTopProducts } from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import Loader from '../components/common/Loader';
import SplitImageHero from '../components/common/SplitImageHero';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const products = await getTopProducts(4);
        setFeaturedProducts(products);
      } catch (error) {
        console.error('Error fetching top products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative">
        <SplitImageHero />
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Popular Dishes</h2>
            <Link to="/products" className="text-orange-500 hover:text-orange-600 flex items-center font-semibold">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
          <div className="flex gap-4">
            <Link to="/products" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-orange-500/25">
              Explore Menu
            </Link>
            <Link to="/products/new-arrivals" className="border-2 border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg">
              New Items
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Order by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Non veg */}
            <div className="relative group overflow-hidden rounded-lg h-96 food-category-card">
              <img 
                src="https://i.pinimg.com/originals/eb/07/fb/eb07fbadd098d0c1b4455daae8025210.jpg" 
                alt="Non veg" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Nonveg</h3>
                <p className="text-gray-200 mb-4">We make food magic</p>
                <Link to="/products/appetizers" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                  Explore<ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Veg */}
            <div className="relative group overflow-hidden rounded-lg h-96 food-category-card">
              <img 
                src="https://cdn.apartmenttherapy.info/image/fetch/f_auto,q_auto:eco/https://storage.googleapis.com/gen-atmedia/3/2017/04/0ffafc36a752e3ac2601ae070b6162027a4b1be1.jpeg" 
                alt="veg" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Veg</h3>
                <p className="text-gray-200 mb-4">Good food,good mood</p>
                <Link to="/products/healthy" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                  Explore <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Chinese */}
            <div className="relative group overflow-hidden rounded-lg h-96 food-category-card">
              <img 
                src="https://ik.imagekit.io/shortpedia/Voices/wp-content/uploads/2021/10/chinese-food-1200x900@kohinoorjoy.jpg" 
                alt="chinese" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Chinese</h3>
                <p className="text-gray-200 mb-4">It's food o'clock</p>
                <Link to="/products/chinese" className="inline-flex items-center text-orange-400 hover:text-orange-300 transition-colors">
                  Explore<ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Popular Dishes</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Discover our most loved dishes, carefully prepared with fresh ingredients and authentic flavors.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Show skeleton loaders while loading
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="card animate-pulse">
                  <div className="bg-dark-700 h-64 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-dark-600 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-dark-600 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : featuredProducts.length === 0 ? (
              // Show message if no products found
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-600">No dishes available at the moment.</p>
              </div>
            ) : (
              // Show actual products
              featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/products" className="btn-primary">
              View All Dishes
            </Link>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" 
                  alt="Fresh ingredients" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=400&h=300&fit=crop" 
                  alt="Professional kitchen" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
                  alt="Chef preparing food" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
                <img 
                  src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop" 
                  alt="Fresh salad" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Food Promise</h2>
              <p className="text-gray-600 mb-6">
                At QuickBite, we believe great food starts with fresh ingredients and passionate preparation. Every dish is crafted with care using locally sourced produce and authentic recipes, ensuring exceptional taste and quality.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-orange-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Fresh ingredients sourced daily from local farms</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Prepared fresh to order for maximum flavor</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">No artificial preservatives or additives</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-orange-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-700">Fast delivery while food is still hot and fresh</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">Stay Updated</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals, new menu items, and special offers.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="w-full px-4 py-3 rounded-xl bg-white border border-orange-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-500 flex-grow"
              required
            />
            <button type="submit" className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;