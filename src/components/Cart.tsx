import React from 'react';
import { Trash2, X, Plus, Minus, ShoppingCart, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onClose: () => void;
  isModal?: boolean;
}

export const Cart: React.FC<CartProps> = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClose,
  isModal = true
}) => {
  const navigate = useNavigate();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    onClose(); // Close the cart first
    toast.loading('Preparing checkout...', { duration: 1000 });
    setTimeout(() => {
      navigate('/shipping');
    }, 300);
  };

  const cartContent = (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Shopping Cart</h2>
        <button onClick={onClose} className="text-white hover:text-teal-100 transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-indigo-600 font-bold">${item.price}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.id)}
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

      {items.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Proceed to Checkout
          </button>
        </div>
      )}
    </>
  );

  if (isModal) {
    return (
      <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto z-50">
        <div className="bg-white w-full max-w-md rounded-l-2xl shadow-2xl flex flex-col h-full">
          <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-tl-2xl">
            {cartContent}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600">
          {cartContent}
        </div>
      </div>
    </div>
  );
};