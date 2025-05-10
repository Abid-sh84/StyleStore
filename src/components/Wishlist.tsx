import React from 'react';
import { X, Trash2, Heart } from 'lucide-react';
import { Product } from '../types';

interface WishlistProps {
  items: Product[];
  onClose: () => void;
  onRemoveFromWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({
  items,
  onClose,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg flex flex-col h-full z-50">
      <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Wishlist</h2>
          <button onClick={onClose} className="text-white hover:text-teal-100 transition-colors">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <Heart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent font-bold">
                    ${item.price}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onAddToCart(item)}
                      className="px-3 py-1 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full text-sm hover:from-teal-700 hover:to-emerald-700 transition-all"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(item)}
                      className="ml-auto text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};