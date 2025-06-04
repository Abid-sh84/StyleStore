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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
            <Link to="/products" className="text-primary-500 hover:text-primary-400 flex items-center">
              View All <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
          <div className="flex gap-4">
            <Link to="/products" className="btn-primary">
              Shop Collection
            </Link>
            <Link to="/products/new-arrivals" className="btn-outline">
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-dark-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Men Category */}
            <div className="relative group overflow-hidden rounded-lg h-96">
              <img 
                src="https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Men's T-shirts" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Men</h3>
                <p className="text-gray-300 mb-4">Sleek designs for the modern man</p>
                <Link to="/products/men" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                  Shop Now <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Women Category */}
            <div className="relative group overflow-hidden rounded-lg h-96">
              <img 
                src="https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Women's T-shirts" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Women</h3>
                <p className="text-gray-300 mb-4">Elegance meets comfort</p>
                <Link to="/products/women" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                  Shop Now <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Kids Category */}
            <div className="relative group overflow-hidden rounded-lg h-96">
              <img 
                src="https://images.pexels.com/photos/3771679/pexels-photo-3771679.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                alt="Kids' T-shirts" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Kids</h3>
                <p className="text-gray-300 mb-4">Playful styles for little ones</p>
                <Link to="/products/kids" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
                  Shop Now <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-dark-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Featured Collection</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">Our most popular designs curated for the season. High-quality fabrics meet exceptional design.</p>
          
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
                <p className="text-gray-400">No featured products available at the moment.</p>
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
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Quality Promise */}
      <section className="py-16 bg-dark-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="grid grid-cols-2 gap-4">
                <img 
                  src="https://wallpapers.com/images/featured/fondos-de-ropa-ot7pkynbf8g28jsr.jpg" 
                  alt="T-shirt material" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
                <img 
                  src="https://th.bing.com/th/id/R.8f25b73a309447c8a5184f08c3a9f9c2?rik=qgg%2flRI3XNQK7g&riu=http%3a%2f%2fodalisquemagazine.com%2fsites%2fdefault%2ffiles%2fstyles%2fmedium%2fpublic%2fwaves12.jpg%3fitok%3dPoLn5HvV&ehk=h8JZTHYFe77GG5jtPFY1fRKott4brzeScKb1JgY1i1E%3d&risl=&pid=ImgRaw&r=0" 
                  alt="Clothing manufacturing" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/5699101/pexels-photo-5699101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Quality fabric detail" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
                <img 
                  src="https://images.pexels.com/photos/4614227/pexels-photo-4614227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Clothing workshop" 
                  className="rounded-lg shadow-xl w-full h-48 object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Quality Promise</h2>
              <p className="text-gray-300 mb-6">
                At STYLESTORE, we believe that the perfect t-shirt is a blend of premium materials, thoughtful design, and ethical manufacturing. Each piece is crafted with care using 100% organic cotton, ensuring both comfort and durability.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>100% organic cotton for incredible softness</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Pre-shrunk to maintain the perfect fit wash after wash</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Ethically manufactured in sustainable facilities</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-500 rounded-full p-1 mr-3 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span>Durable stitching for long-lasting wear</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-primary-900 to-dark-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive deals, new arrivals, and style inspiration.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="form-input flex-grow"
              required
            />
            <button type="submit" className="btn-accent whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;