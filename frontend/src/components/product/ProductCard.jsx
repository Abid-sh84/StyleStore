import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Clock, Star } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) {
      console.error("Cannot add undefined product to cart");
      return;
    }

    // Don't add to cart if product is out of stock
    if (product.countInStock <= 0) {
      console.warn("Cannot add out-of-stock product to cart");
      return;
    }
    
    // Ensure product has required fields
    const validProduct = {
      ...(product || {}),
      _id: product._id || product.id || Date.now().toString(), // Fallback ID if none exists
      name: product.name || "Unknown Product",
      price: typeof product.price === 'number' ? product.price : 0,
      images: Array.isArray(product.images) ? product.images : 
              (product.image ? [product.image] : [])
    };
    
    addToCart(validProduct, 1);
  };

  return (
    <div className="card group food-card-hover">
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}
          
          {product.discountPercentage > 0 && (
            <span className="absolute top-2 right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded">
              {product.discountPercentage}% OFF
            </span>
          )}
          
          {(!product.countInStock || product.countInStock <= 0) && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
              SOLD OUT
            </span>
          )}
          
          {product.isVegetarian && (
            <span className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
              VEG
            </span>
          )}
          
          {product.isVegan && (
            <span className="absolute bottom-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded">
              VEGAN
            </span>
          )}
          
          {product.spiceLevel && product.spiceLevel !== 'none' && (
            <span className="absolute bottom-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              🌶️ {product.spiceLevel.toUpperCase()}
            </span>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={handleAddToCart}
              disabled={!product.countInStock || product.countInStock <= 0}
              className={`bg-white text-gray-900 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-orange-500/25 ${
                (!product.countInStock || product.countInStock <= 0) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title={(!product.countInStock || product.countInStock <= 0) ? 'Sold Out' : 'Add to Cart'}
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 truncate">{product.name}</h3>
          
          {/* Restaurant name */}
          {product.restaurant && (
            <p className="text-gray-600 text-sm mb-2">{product.restaurant}</p>
          )}
          
          {/* Rating and preparation time */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1">
              <Star size={14} className="text-yellow-400 fill-current" />
              <span className="text-sm text-gray-700">{product.rating || 0}</span>
              <span className="text-sm text-gray-500">({product.numReviews || 0})</span>
            </div>
            {product.preparationTime && (
              <div className="flex items-center space-x-1 text-gray-600">
                <Clock size={14} />
                <span className="text-sm">{product.preparationTime} min</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              {product.discountPercentage > 0 ? (
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-primary-600">${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</span>
                  <span className="text-gray-500 text-sm line-through">${product.price.toFixed(2)}</span>
                </div>
              ) : (
                <span className="font-semibold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            <div className="text-sm text-gray-600 capitalize">{product.category}</div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;