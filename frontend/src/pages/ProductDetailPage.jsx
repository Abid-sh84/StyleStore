import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { ChevronRight, Star, Truck, ArrowLeft, ShoppingBag, Check, Minus, Plus } from 'lucide-react';
import { getProductById, addProductReview } from '../services/productService';

// Dummy products (would normally come from API)
const dummyProducts = [
  {
    _id: '1',
    name: 'Margherita Pizza',
    price: 12.99,
    category: 'pizza',
    images: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'A classic Margherita pizza made with fresh mozzarella, San Marzano tomatoes, and fresh basil. Hand-tossed dough baked in our wood-fired oven for the perfect crispy crust. A timeless favorite that never goes out of style.',
    features: [
      'Wood-fired oven baked',
      'Fresh mozzarella cheese',
      'San Marzano tomatoes',
      'Fresh basil leaves',
      'Hand-tossed dough',
      'Vegetarian friendly'
    ],
    sizes: ['Small (10")', 'Medium (12")', 'Large (14")', 'Extra Large (16")'],
    spiceLevel: 'Mild',
    restaurant: 'Bella Vista',
    isNew: true,
    discountPercentage: 0,
    rating: 4.8,
    numReviews: 124,
    inStock: true
  },
  {
    _id: '2',
    name: 'Chicken Tikka Masala',
    price: 16.99,
    category: 'indian',
    images: [
      'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1627662235862-1eb57d45ba73?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tender chunks of chicken marinated in yogurt and spices, grilled and simmered in a rich, creamy tomato-based sauce. Served with fragrant basmati rice and fresh naan bread. A beloved Indian classic with perfect balance of spices.',
    features: [
      'Marinated chicken breast',
      'Creamy tomato sauce',
      'Aromatic basmati rice',
      'Fresh naan bread',
      'Traditional spices',
      'Gluten-free option available'
    ],
    sizes: ['Regular', 'Large', 'Family Pack'],
    spiceLevel: 'Medium',
    restaurant: 'Spice Garden',
    isNew: false,
    discountPercentage: 10,
    rating: 4.6,
    numReviews: 89,
    inStock: true
  },
  {
    _id: '3',
    name: 'Grilled Chicken Burger',
    price: 14.99,
    category: 'burgers',
    images: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Juicy grilled chicken breast served on a toasted brioche bun with fresh lettuce, tomato, and our signature sauce. Comes with crispy seasoned fries. A healthier take on the classic burger experience.',
    features: [
      'Grilled chicken breast',
      'Brioche bun',
      'Fresh vegetables',
      'Signature sauce',
      'Seasoned fries included',
      'High protein meal'
    ],
    sizes: ['Regular', 'Double Patty'],
    spiceLevel: 'Mild',
    restaurant: 'Burger House',
    isNew: false,
    discountPercentage: 0,
    rating: 4.5,
    numReviews: 67,
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
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(id);
        console.log('Product data from API:', productData);
        // Ensure inStock defaults to true if not specified
        if (productData.inStock === undefined) {
          productData.inStock = true;
        }
        // Ensure sizes array exists, add default if not
        if (!productData.sizes || productData.sizes.length === 0) {
          productData.sizes = ['Regular'];
        }
        setProduct(productData);
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0]);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        // Fallback to dummy data
        const foundProduct = dummyProducts.find(p => p._id === id);
        console.log('Using dummy product:', foundProduct);
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedSize(foundProduct.sizes[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    console.log('Add to cart clicked');
    console.log('Selected Size:', selectedSize);
    console.log('Product in stock:', product?.inStock);
    console.log('Product:', product);
    console.log('Product sizes:', product?.sizes);
    
    // Check if size is required (only if product has sizes)
    const sizeRequired = product?.sizes && product.sizes.length > 0;
    if (sizeRequired && !selectedSize) {
      console.log('Cannot add to cart - no size selected');
      return;
    }
    
    if (!product) {
      console.log('Cannot add to cart - no product data');
      return;
    }
    
    // Pass the product object directly to addToCart, along with quantity and size
    try {
      const finalSize = selectedSize || 'Regular';
      addToCart(product, quantity, finalSize, 'default');
      setAddedToCart(true);
      console.log('Successfully added to cart');
      
      // Reset added to cart status after 3 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center pt-16">
        <Loader size="lg" text="Loading dish details..." />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="container mx-auto px-4 py-24 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Dish Not Found</h2>
          <p className="text-gray-600 mb-6">The dish you're looking for doesn't exist or has been removed from our menu.</p>
          <Link to="/products" className="btn-primary">
            <ArrowLeft size={18} className="mr-2" />
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-4 py-24">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-600">Home</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/products" className="hover:text-orange-600">Menu</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to={`/products/${product.category}`} className="hover:text-orange-600">
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-500">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Product Images */}
          <div>
            <div className="mb-4 overflow-hidden rounded-lg bg-white shadow-lg">
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
                    activeImage === index ? 'border-orange-500' : 'border-transparent'
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
        
          {/* Product Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center mb-2">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 ml-2">({product.numReviews} reviews)</span>
              </div>
              {product.restaurant && (
                <p className="text-orange-600 font-medium">from {product.restaurant}</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-orange-600">${product.price.toFixed(2)}</span>
                {product.discountPercentage > 0 && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full ml-3">
                    NEW
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Spice Level (for applicable categories) */}
            {product.spiceLevel && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2 text-gray-800">Spice Level: <span className="font-normal text-orange-600">{product.spiceLevel}</span></h3>
              </div>
            )}
            
            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-800">Size</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-center rounded-md transition-colors ${
                        selectedSize === size
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity and Add to Cart */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-md">
                <button 
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <button 
                onClick={handleAddToCart}
                disabled={(product?.sizes && product.sizes.length > 0 && !selectedSize)}
                className={`flex-1 px-6 py-3 rounded-md font-medium transition-colors ${
                  addedToCart 
                    ? 'bg-green-600 text-white'
                    : (product?.sizes && product.sizes.length > 0 && !selectedSize)
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {addedToCart ? (
                  <span className="flex items-center justify-center">
                    <Check size={20} className="mr-2" />
                    Added to Cart!
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ShoppingBag size={20} className="mr-2" />
                    Add to Cart
                  </span>
                )}
              </button>
            </div>
            
            {product.inStock === false && (
              <p className="text-red-500 text-sm">Out of stock</p>
            )}
            
            {/* Delivery Info */}
            <div className="flex items-start bg-gray-50 p-4 rounded-lg mb-6">
              <Truck size={20} className="text-orange-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium mb-1 text-gray-800">Free Delivery</h4>
                <p className="text-sm text-gray-600">Free delivery on orders over $25. Estimated delivery: 30-45 minutes.</p>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h3 className="text-lg font-medium mb-3 text-gray-800">What's Included</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <span className="bg-orange-500 rounded-full p-1 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Review List */}
            <div>
              <div className="mb-4 flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium ml-2 text-gray-800">{product.rating.toFixed(1)}</span>
                <span className="text-gray-600 ml-2">({product.numReviews} reviews)</span>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div key={index} className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                      <div className="flex items-center mb-2">
                        <h4 className="font-medium text-gray-800">{review.name}</h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No reviews yet. Be the first to review this dish!</p>
              )}
            </div>
            
            {/* Review Form */}
            <div>
              <h3 className="text-xl font-medium mb-4 text-gray-800">Write a Review</h3>
              
              {reviewSuccess && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-4">
                  <p className="text-green-600 flex items-center">
                    <Check size={18} className="mr-2" />
                    Review submitted successfully!
                  </p>
                </div>
              )}
              
              {reviewError && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-4">
                  <p className="text-red-600">{reviewError}</p>
                </div>
              )}
              
              {!user ? (
                <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                  <p className="text-gray-700 mb-4">Please sign in to write a review</p>
                  <Link to="/login" className="btn-primary">Sign In</Link>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-800">Your Rating</label>
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
                            className={star <= reviewFormData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="comment" className="block mb-2 text-sm font-medium text-gray-800">Your Review</label>
                    <textarea
                      id="comment"
                      rows={4}
                      value={reviewFormData.comment}
                      onChange={(e) => setReviewFormData(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder="What did you like or dislike about this dish?"
                      className="w-full p-3 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-gray-800"
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
    </div>
  );
};

export default ProductDetailPage;
