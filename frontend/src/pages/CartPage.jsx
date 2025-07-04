import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Check if cart exists and has required properties
  if (!cart || !cart.items) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-xl border border-orange-100">
              <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={64} className="text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Loading cart...</h2>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const shippingCost = cart.total >= 50 ? 0 : 5.99;
  const tax = cart.total * 0.08; // 8% tax
  const orderTotal = cart.total + shippingCost + tax;
  
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-xl border border-orange-100">
              <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={64} className="text-orange-500" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any delicious dishes to your cart yet.</p>
              <Link to="/products" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg">
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-orange-100">
              <div className="p-6">
                <div className="flex justify-between items-center pb-4 border-b border-orange-100">
                  <h2 className="text-xl font-bold text-gray-900">
                    Cart ({cart.items.reduce((total, item) => total + item.quantity, 0)} items)
                  </h2>
                  <button 
                    onClick={clearCart}
                    className="text-sm text-red-500 hover:text-red-600 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
                
                {cart.items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="py-6 border-b border-orange-100 last:border-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      </div>
                      <div className="flex-grow sm:ml-6">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-1">Size: {item.size}</p>
                            <p className="text-sm text-gray-600 mb-3">Color: {item.color}</p>
                            <div className="flex items-center bg-orange-50 rounded-xl p-2 w-fit">
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="p-1 text-orange-600 hover:text-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="mx-3 w-8 text-center font-semibold text-gray-900">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                                className="p-1 text-orange-600 hover:text-orange-700"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-lg mb-4 text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                            <button 
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                              className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-xl transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <Link to="/products" className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium">
                <ArrowLeft size={16} className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 sticky top-24 shadow-xl border border-orange-100">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Subtotal</span>
                  <span className="font-semibold text-gray-900">${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Shipping</span>
                  <span className="font-semibold text-gray-900">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Tax</span>
                  <span className="font-semibold text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-orange-100 pt-3 flex justify-between font-bold text-lg">
                  <span className="text-gray-900">Total</span>
                  <span className="text-orange-600">${orderTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2 font-medium">We accept:</p>
                <div className="flex space-x-2">
                  <span className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 font-medium">Visa</span>
                  <span className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 font-medium">Mastercard</span>
                  <span className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2 font-medium">PayPal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;