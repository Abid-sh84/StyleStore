import React, { useState, useEffect } from 'react';
import { Trash2, X, Plus, Minus, ShoppingCart, ShoppingBag, ArrowLeft, Package, Clock } from 'lucide-react';
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
  const [animateItems, setAnimateItems] = useState(false);
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Get estimated delivery date (5 business days from now)
  const getEstimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    // Animate items when cart is opened
    setAnimateItems(true);
  }, []);

  const handleProceedToCheckout = () => {
    onClose(); // Close the cart first
    toast.loading('Preparing checkout...', { duration: 1000 });
    setTimeout(() => {
      navigate('/shipping');
    }, 300);
  };
  
  const continueShopping = () => {
    onClose();
    navigate('/');
  };
  const cartContent = (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingCart size={24} />
          Shopping Cart {itemCount > 0 && <span className="text-sm bg-white text-teal-600 rounded-full px-2 py-0.5 ml-2">{itemCount}</span>}
        </h2>
        <button onClick={onClose} className="text-white hover:text-teal-100 transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        {items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <ShoppingCart size={80} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <button 
              onClick={continueShopping}
              className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto hover:from-teal-700 hover:to-emerald-700 transition-all"
            >
              <ArrowLeft size={18} />
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className={`space-y-6 transition-all duration-500 ${animateItems ? 'opacity-100' : 'opacity-0 transform translate-y-4'}`}>
              {items.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <img src={item.image} alt={item.name} className="w-full sm:w-24 h-24 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-indigo-600 font-bold">${item.price.toFixed(2)}</p>
                    </div>
                    
                    {/* Display selected options */}
                    {(item.selectedSize || item.selectedColor) && (
                      <div className="mt-1 text-xs text-gray-500 space-x-2">
                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        {item.selectedColor && (
                          <span className="inline-flex items-center">
                            Color: {item.selectedColor}
                            <span 
                              className="ml-1 w-3 h-3 rounded-full inline-block" 
                              style={{ backgroundColor: item.selectedColor.toLowerCase() }}
                            ></span>
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="ml-auto text-red-500 hover:text-red-700 transition-colors flex items-center gap-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                        <span className="text-sm hidden sm:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Delivery estimate */}
            <button 
              className="mt-4 w-full text-left flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              onClick={() => setShowDeliveryInfo(!showDeliveryInfo)}
            >
              <div className="flex items-center gap-2">
                <Package size={18} className="text-teal-600" />
                <span className="font-medium">Estimated Delivery</span>
              </div>
              <span className={`transform transition-transform ${showDeliveryInfo ? 'rotate-180' : 'rotate-0'}`}>
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
            </button>
            
            {showDeliveryInfo && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg animate-fadeIn">
                <div className="flex items-start gap-3">
                  <Clock size={20} className="text-teal-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated arrival by:</p>
                    <p className="text-gray-600">{getEstimatedDeliveryDate()}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">Free standard shipping on orders over $50</p>
              </div>
            )}
          </>
        )}
      </div>      {items.length > 0 && (
        <div className="border-t p-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Shipping</span>
              <span>{total > 50 ? 'Free' : '$4.99'}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-2 border-t">
              <span>Total</span>
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                ${total > 50 ? total.toFixed(2) : (total + 4.99).toFixed(2)}
              </span>
            </div>
          </div>
          
          <button
            onClick={handleProceedToCheckout}
            className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-3 rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShoppingBag size={20} />
            Proceed to Checkout
          </button>
          
          <button 
            onClick={continueShopping}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Continue Shopping
          </button>
        </div>
      )}
    </>
  );
  if (isModal) {
    return (
      <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gradient-to-br from-teal-50 via-white to-emerald-50 shadow-lg overflow-y-auto z-50">
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
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-teal-600 to-emerald-600">
            {cartContent}
          </div>
        </div>
      </div>
    </div>
  );
};