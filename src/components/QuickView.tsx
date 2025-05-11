import React from 'react';
import { X, Star, ShoppingCart, Heart, Package } from 'lucide-react';
import { Product } from '../types';
import Reviews from './Reviews';
import toast from 'react-hot-toast';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  isInWishlist: boolean;
}

export const QuickView: React.FC<QuickViewProps> = ({ 
  product, 
  onClose, 
  onAddToCart, 
  onAddToWishlist,
  isInWishlist
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discount && product.discount > 0 && (
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{product.discount}%
                </span>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <div className="p-6 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h2>
            <p className="text-gray-600 mb-4">{product.description}</p>            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                ${product.price.toFixed(2)}
              </span>
              {product.discount && product.discount > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  ${(product.price / (1 - (product.discount / 100))).toFixed(2)}
                </span>
              )}
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  onAddToCart(product);
                  toast.success('Added to cart!');
                }}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>

              <button
                onClick={() => {
                  onAddToWishlist(product);
                  toast.success(isInWishlist ? 'Removed from wishlist!' : 'Added to wishlist!');
                }}
                className={`w-full py-3 rounded-xl border transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2
                  ${
                    isInWishlist
                      ? 'border-teal-600 text-teal-600 hover:bg-teal-50'
                      : 'border-gray-300 text-gray-700 hover:border-teal-600 hover:text-teal-600'
                  }`}
              >
                <Heart size={20} className={isInWishlist ? 'fill-teal-600' : ''} />
                {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-800 mb-2">Product Details</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center gap-2">
                  <Package size={18} />
                  Category: {product.category}
                </li>
                <li className="flex items-center gap-2">
                  <Star size={18} />
                  Rating: {product.rating}/5
                </li>
                {/* Add more product details as needed */}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="px-6 pb-6">
          <Reviews productId={product.id.toString()} />
        </div>
      </div>
    </div>
  );
};