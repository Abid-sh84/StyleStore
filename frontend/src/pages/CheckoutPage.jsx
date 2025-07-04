import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, ArrowLeft } from 'lucide-react';
import PayPalButton from '../components/payment/PayPalButton';
import { createOrder, updateOrderToPaid } from '../services/orderService';
import { systemService } from '../services/systemService';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  });
    const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  
  const shippingCost = cart.total >= 50 ? 0 : 5.99;
  const tax = cart.total * 0.08; // 8% tax
  const orderTotal = cart.total + shippingCost + tax;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // This handler is only used for COD orders
    if (paymentMethod !== 'cod') return;
    
    setLoading(true);
    
    try {
      // Create order in backend
      const orderData = {
        orderItems: cart.items.map(item => ({
          ...item,
          product: item.id,
        })),
        shippingAddress: {
          address: shippingDetails.address,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
        },
        paymentMethod: 'Cash on Delivery',
        itemsPrice: cart.total,
        taxPrice: tax,
        shippingPrice: shippingCost,
        totalPrice: orderTotal,
      };
      
      try {
        // Create the order in backend
        const order = await createOrder(orderData);
        clearCart();
        // First navigate to success page
        navigate('/order-success', { state: { orderId: order._id } });
      } catch (orderError) {
        console.error('Order creation failed:', orderError);
        alert('There was a problem creating your order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };  const handlePayPalSuccess = async (paymentResult) => {
    setLoading(true);
    try {
      // Step 1: Create order in backend
      const orderData = {
        orderItems: cart.items.map(item => ({
          ...item,
          product: item.id,
        })),
        shippingAddress: {
          address: shippingDetails.address,
          city: shippingDetails.city,
          postalCode: shippingDetails.postalCode,
          country: shippingDetails.country,
        },
        paymentMethod: 'PayPal',
        itemsPrice: cart.total,
        taxPrice: tax,
        shippingPrice: shippingCost,
        totalPrice: orderTotal,
      };
      
      // Create the order
      const order = await createOrder(orderData);
      
      // Step 2: Format PayPal result to match what backend expects
      const formattedPaymentResult = {
        id: paymentResult.id,
        status: paymentResult.status,
        update_time: paymentResult.update_time || paymentResult.create_time,
        payer: {
          email_address: paymentResult.payer?.email_address || paymentResult.payer?.email || '',
        }
      };
      
      // Step 3: Update order to paid status using the specific API endpoint
      await updateOrderToPaid(order._id, formattedPaymentResult);
      
      // Clear the cart and navigate
      clearCart();
      navigate('/order-success', { state: { orderId: order._id } });
    } catch (error) {
      console.error('PayPal payment process failed:', error);
      alert('There was a problem processing your payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    // No need for API testing
  
  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <button 
          onClick={() => navigate('/cart')} 
          className="flex items-center text-orange-600 hover:text-orange-700 mb-6 font-medium"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Cart
        </button>
        
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <Truck size={20} className="text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-gray-700 font-medium mb-2">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-gray-700 font-medium mb-2">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingDetails.postalCode}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-gray-700 font-medium mb-2">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingDetails.country}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-3 py-3 bg-white border border-orange-200 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-white rounded-lg p-6 mb-6 shadow-lg border border-orange-100">
              <div className="flex items-center mb-4">
                <CreditCard size={20} className="text-orange-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
              </div>
                <div className="space-y-3">
                <label className="flex items-center p-3 border border-orange-200 rounded-md cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-gray-900">Cash on Delivery (COD)</span>
                </label>
                
                <label className="flex items-center p-3 border border-orange-200 rounded-md cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-gray-900">PayPal</span>
                </label>
              </div>
              
              {paymentMethod === 'paypal' && (
                <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700 mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <PayPalButton
                    amount={orderTotal}
                    onSuccess={handlePayPalSuccess}
                  />
                </div>
              )}
              
              {paymentMethod === 'cod' && (
                <div className="mt-6 bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-700">
                    Pay with cash when your order is delivered. Please note that some locations may not be eligible for COD.
                  </p>
                </div>
              )}
            </div>
              {paymentMethod === 'cod' && (
              <button 
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 hover:shadow-lg font-medium"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Processing...
                  </span>
                ) : (
                  `Place Order - $${orderTotal.toFixed(2)}`
                )}
              </button>
            )}
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:pl-8">
          <div className="bg-white rounded-lg p-6 sticky top-24 shadow-lg border border-orange-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Order Summary</h2>
            
            {/* Order Items */}
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-orange-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${cart.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t border-orange-200">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;