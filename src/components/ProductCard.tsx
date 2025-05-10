import React from 'react';
import { Plus, Heart, Eye, ShoppingBag, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onQuickView: () => void;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onQuickView,
  isInWishlist,
  onToggleWishlist
}) => {
  const navigate = useNavigate();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist();
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  
    try {
      // Validate product
      if (!product.id || product.price == null) {
        throw new Error('Product information is incomplete');
      }
  
      // Check authentication
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        throw new Error('You must be logged in to place an order');
      }
  
      // Place order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
          status: 'pending',
          created_at: new Date().toISOString(),
        });
  
      if (orderError) {
        throw orderError;
      }
  
      toast.success('Order placed successfully!');
      navigate('/shipping');
  
    } catch (error: unknown) {
      console.error('Order error:', error);
      
      // Extract error message safely
      const errorMessage = getErrorMessage(error);
      toast.error(`Order failed: ${errorMessage}`);
    }
  };
  
  // Helper function for type-safe error message extraction
  function getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as { message: unknown }).message);
    }
    return 'An unknown error occurred';
  }

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 space-y-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleWishlist();
            }}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 focus:outline-none"
          >
            <Heart
              size={20}
              className={`${isInWishlist ? 'fill-teal-600 text-teal-600' : 'text-gray-600'}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              onQuickView();
            }}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-110 focus:outline-none"
          >
            <Eye size={20} className="text-gray-600" />
          </button>
        </div>
        {product.discount > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              -{product.discount}%
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              ${product.price.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart(product);
            }}
            className="p-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-110 focus:outline-none"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};