import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { ChevronRight, Star, Truck, ArrowLeft, ShoppingBag, Check } from 'lucide-react';
import { getProductById, addProductReview } from '../services/productService';

// Dummy products (would normally come from API)
const dummyProducts = [
  {
    _id: '1',
    name: 'Classic Black Tee',
    price: 29.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/5082961/pexels-photo-5082961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6311669/pexels-photo-6311669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'A timeless black t-shirt made from premium cotton. This classic piece features a comfortable regular fit, ribbed crew neck, and is crafted from 100% organic cotton for breathability and softness. Perfect for everyday wear or layering with your favorite outfits.',
    features: [
      '100% Organic Cotton',
      'Regular fit',
      'Crew neck',
      'Pre-shrunk fabric',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'White'],
    isNew: true,
    discountPercentage: 0,
    rating: 4.8,
    numReviews: 24,
    inStock: true
  },
  {
    _id: '2',
    name: 'Vintage Print Tee',
    price: 34.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/6311387/pexels-photo-6311387.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/9558583/pexels-photo-9558583.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/7679737/pexels-photo-7679737.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Vintage-inspired graphic t-shirt with a classic print. Features a relaxed fit with a unique distressed graphic on the front. Made from a soft cotton blend that provides exceptional comfort and durability.',
    features: [
      '90% Cotton, 10% Polyester',
      'Relaxed fit',
      'Crew neck',
      'Vintage wash',
      'Screen printed graphic'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Gray', 'Black', 'White'],
    isNew: false,
    discountPercentage: 15,
    rating: 4.5,
    numReviews: 18,
    inStock: true
  },
  {
    _id: '7',
    name: 'Premium Navy Tee',
    price: 32.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/6311672/pexels-photo-6311672.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/5082961/pexels-photo-5082961.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6311669/pexels-photo-6311669.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Premium quality navy t-shirt with perfect fit. This luxury tee is made from high-quality combed cotton, providing exceptional softness and durability. Features a modern slim fit design that flatters your silhouette.',
    features: [
      '95% Combed Cotton, 5% Elastane',
      'Slim fit',
      'Crew neck',
      'Reinforced seams',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'Black', 'Gray'],
    isNew: false,
    discountPercentage: 0,
    rating: 4.9,
    numReviews: 32,
    inStock: true
  },
  {
    _id: '9',
    name: 'Modern Striped Tee',
    price: 36.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/6975184/pexels-photo-6975184.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6975188/pexels-photo-6975188.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/6975193/pexels-photo-6975193.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Modern striped t-shirt with contemporary design. Features subtle horizontal stripes that add style to your casual wardrobe. Made from a soft blend of cotton and modal for exceptional comfort and drape.',
    features: [
      '70% Cotton, 30% Modal',
      'Regular fit',
      'Crew neck',
      'Horizontal stripe pattern',
      'Machine washable'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blue/White', 'Black/Gray', 'Green/White'],
    isNew: true,
    discountPercentage: 0,
    rating: 4.6,
    numReviews: 14,
    inStock: true
  },
  {
    _id: '10',
    name: 'Athletic Performance Tee',
    price: 39.99,
    category: 'men',
    images: [
      'https://images.pexels.com/photos/7987347/pexels-photo-7987347.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/7987357/pexels-photo-7987357.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      'https://images.pexels.com/photos/7987353/pexels-photo-7987353.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
    ],
    description: 'Technical athletic t-shirt designed for performance. Features moisture-wicking fabric that keeps you dry during workouts, with anti-odor technology to keep you fresh. The lightweight material and ergonomic design provide comfort and freedom of movement.',
    features: [
      '88% Polyester, 12% Elastane',
      'Athletic fit',
      'Crew neck',
      'Moisture-wicking',
      'Anti-odor technology',
      'Quick dry'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red', 'Black', 'Blue'],
    isNew: false,
    discountPercentage: 10,
    rating: 4.7,
    numReviews: 42,
    inStock: true
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    rating: 5,
    comment: ''
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Get from API
        const data = await getProductById(id);
        setProduct(data);
        if (data) {
          setSelectedSize(data.sizes[1] || data.sizes[0]); // Default to medium if available
          setSelectedColor(data.colors[0]); // Default to first color
          setReviews(data.reviews || []); // Set reviews from product data
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        // Fallback to dummy data in case of API error
        alert('Could not connect to the server. Loading sample data instead.');
        
        const foundProduct = dummyProducts.find(p => p._id === id);
        setProduct(foundProduct);
        if (foundProduct) {
          setSelectedSize(foundProduct.sizes[1] || foundProduct.sizes[0]);
          setSelectedColor(foundProduct.colors[0]);
          setReviews(foundProduct.reviews || []);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedSize && selectedColor) {
      addToCart(product, quantity, selectedSize, selectedColor);
      setAddedToCart(true);
      
      // Reset added to cart status after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setReviewError('You must be logged in to submit a review');
      return;
    }
    
    try {
      setReviewSubmitting(true);
      setReviewError('');
      
      await addProductReview(id, reviewFormData);
      
      // Refresh product data to show the new review
      const updatedProduct = await getProductById(id);
      setProduct(updatedProduct);
      
      // Reset form and show success message
      setReviewFormData({ rating: 5, comment: '' });
      setReviewSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setReviewSuccess(false);
      }, 3000);
    } catch (error) {
      setReviewError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader size="lg" text="Loading product details..." />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">
          <ArrowLeft size={18} className="mr-2" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-400">
          <Link to="/" className="hover:text-primary-400">Home</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to="/products" className="hover:text-primary-400">Products</Link>
          <ChevronRight size={16} className="mx-2" />
          <Link to={`/products/${product.category}`} className="hover:text-primary-400">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-300">{product.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <div>
          <div className="mb-4 overflow-hidden rounded-lg bg-dark-700">
            <img 
              src={product.images[activeImage]} 
              alt={product.name}
              className="w-full h-auto object-cover aspect-square"
            />
          </div>
          <div className="flex space-x-2 overflow-auto pb-2">
            {product.images.map((image, index) => (
              <button 
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 rounded overflow-hidden w-20 h-20 border-2 ${
                  activeImage === index ? 'border-primary-500' : 'border-transparent'
                }`}
              >
                <img 
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          {product.isNew && (
            <span className="inline-block bg-primary-600 text-white text-xs px-2 py-1 rounded mb-2">
              NEW
            </span>
          )}
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  size={18}
                  className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                />
              ))}
            </div>
            <span className="text-gray-300 mr-2">{product.rating}</span>
            <span className="text-gray-400">({product.numReviews} reviews)</span>
          </div>
          
          <div className="mb-6">
            {product.discountPercentage > 0 ? (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-primary-400 mr-2">
                  ${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="ml-2 text-accent-500">
                  Save {product.discountPercentage}%
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-gray-200">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          
          <p className="text-gray-300 mb-6">{product.description}</p>
          
          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Color: <span className="font-normal">{selectedColor}</span></h3>
            <div className="flex space-x-2">
              {product.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-full border-2 ${
                    selectedColor === color
                      ? 'border-primary-500'
                      : 'border-transparent hover:border-gray-500'
                  }`}
                  title={color}
                >
                  <span 
                    className="block h-full w-full rounded-full"
                    style={{ 
                      backgroundColor: color.toLowerCase() === 'white' ? '#f9fafb' : 
                                      color.toLowerCase() === 'black' ? '#111827' : 
                                      color.toLowerCase() === 'navy' ? '#0f172a' : 
                                      color.toLowerCase() === 'gray' ? '#6b7280' : 
                                      color.toLowerCase() === 'blush' ? '#f8b4b4' : 
                                      color.toLowerCase()
                    }}
                  ></span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium">Size</h3>
              <button className="text-xs text-primary-400 hover:text-primary-300">Size Guide</button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-2 text-center rounded-md ${
                    selectedSize === size
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border border-dark-500 rounded-md">
              <button 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="px-3 py-2 text-gray-400 hover:text-white"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="px-3 py-2 min-w-[40px] text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(prev => prev + 1)}
                className="px-3 py-2 text-gray-400 hover:text-white"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.countInStock || product.countInStock <= 0}
              className={`flex-1 btn-primary flex items-center justify-center ${
                !product.countInStock || product.countInStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {addedToCart ? (
                <>
                  <Check size={18} className="mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={18} className="mr-2" />
                  {product.countInStock && product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </>
              )}
            </button>
          </div>
          
          {/* Shipping Info */}
          <div className="flex items-start bg-dark-700 p-4 rounded-md mb-6">
            <Truck size={20} className="text-primary-500 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium mb-1">Free Shipping</h4>
              <p className="text-sm text-gray-400">Free standard shipping on orders over $50. Estimated delivery: 3-5 business days.</p>
            </div>
          </div>
          
          {/* Features */}
          <div>
            <h3 className="text-lg font-medium mb-3">Features</h3>
            <ul className="space-y-2">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="bg-primary-500 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="mt-16 border-t border-dark-600 pt-10">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Review List */}
          <div>
            <div className="mb-4 flex items-center">
              <div className="flex mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={20}
                    className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                  />
                ))}
              </div>
              <span className="text-lg font-medium ml-2">{product.rating.toFixed(1)}</span>
              <span className="text-gray-400 ml-2">({product.numReviews} reviews)</span>
            </div>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div key={index} className="bg-dark-700 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <h4 className="font-medium">{review.name}</h4>
                      <span className="text-xs text-gray-400 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={14}
                          className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                        />
                      ))}
                    </div>
                    <p className="text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
          
          {/* Review Form */}
          <div>
            <h3 className="text-xl font-medium mb-4">Write a Review</h3>
            
            {reviewSuccess && (
              <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg mb-4">
                <p className="text-green-400 flex items-center">
                  <Check size={18} className="mr-2" />
                  Review submitted successfully!
                </p>
              </div>
            )}
            
            {reviewError && (
              <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg mb-4">
                <p className="text-red-400">{reviewError}</p>
              </div>
            )}
            
            {!user ? (
              <div className="bg-dark-700 p-6 rounded-lg">
                <p className="text-gray-300 mb-4">Please sign in to write a review</p>
                <Link to="/login" className="btn-primary">Sign In</Link>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="bg-dark-700 p-6 rounded-lg">
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">Your Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewFormData(prev => ({ ...prev, rating: star }))}
                        className="mr-1 focus:outline-none"
                      >
                        <Star 
                          size={24}
                          className={star <= reviewFormData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="comment" className="block mb-2 text-sm font-medium">Your Review</label>
                  <textarea
                    id="comment"
                    rows={4}
                    value={reviewFormData.comment}
                    onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                    placeholder="What did you like or dislike about this product?"
                    className="w-full p-3 bg-dark-600 border border-dark-500 rounded-md focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;