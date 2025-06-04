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
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-dark-700 rounded-lg p-8">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl font-bold mb-4">Loading cart...</h2>
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
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-dark-700 rounded-lg p-8">
            <ShoppingBag size={64} className="mx-auto mb-4 text-gray-500" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-dark-700 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center pb-4 border-b border-dark-600">
                <h2 className="text-xl font-semibold">
                  Cart ({cart.items.reduce((total, item) => total + item.quantity, 0)} items)
                </h2>
                <button 
                  onClick={clearCart}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Clear Cart
                </button>
              </div>
              
              {cart.items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="py-6 border-b border-dark-600 last:border-0">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-grow sm:ml-6">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-gray-200 mb-1">{item.name}</h3>
                          <p className="text-sm text-gray-400 mb-1">Size: {item.size}</p>
                          <p className="text-sm text-gray-400 mb-3">Color: {item.color}</p>
                          <div className="flex items-center">
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 text-gray-400 hover:text-white disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="mx-2 w-8 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-white"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-semibold mb-4">${(item.price * item.quantity).toFixed(2)}</span>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size, item.color)}
                            className="text-red-400 hover:text-red-300"
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
            <Link to="/products" className="inline-flex items-center text-primary-400 hover:text-primary-300">
              <ArrowLeft size={16} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-dark-700 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="border-t border-dark-600 pt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
            
            <div className="mt-6 text-sm text-gray-400">
              <p className="mb-2">We accept:</p>
              <div className="flex space-x-2">
                <span className="bg-dark-600 rounded px-2 py-1">Visa</span>
                <span className="bg-dark-600 rounded px-2 py-1">Mastercard</span>
                <span className="bg-dark-600 rounded px-2 py-1">PayPal</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;