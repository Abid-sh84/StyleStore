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
    <div className="container mx-auto px-4 py-24">
      <button 
        onClick={() => navigate('/cart')} 
        className="flex items-center text-primary-400 hover:text-primary-300 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Cart
      </button>
      
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <form onSubmit={handleSubmit}>
            {/* Shipping Information */}
            <div className="bg-dark-700 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Truck size={20} className="text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Shipping Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingDetails.firstName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingDetails.lastName}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="form-label">Street Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="form-label">Postal Code</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingDetails.postalCode}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="form-label">Country</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingDetails.country}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            
            {/* Payment Method */}
            <div className="bg-dark-700 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <CreditCard size={20} className="text-primary-500 mr-2" />
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
                <div className="space-y-3">
                <label className="flex items-center p-3 border border-dark-600 rounded-md cursor-pointer hover:border-gray-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>Cash on Delivery (COD)</span>
                </label>
                
                <label className="flex items-center p-3 border border-dark-600 rounded-md cursor-pointer hover:border-gray-500">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span>PayPal</span>
                </label>
              </div>
              
              {paymentMethod === 'paypal' && (
                <div className="mt-6 bg-dark-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                  <PayPalButton
                    amount={orderTotal}
                    onSuccess={handlePayPalSuccess}
                  />
                </div>
              )}
              
              {paymentMethod === 'cod' && (
                <div className="mt-6 bg-dark-600 p-4 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Pay with cash when your order is delivered. Please note that some locations may not be eligible for COD.
                  </p>
                </div>
              )}
            </div>
              {paymentMethod === 'cod' && (
              <button 
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
                    Processing...
                  </span>
                ) : (
                  `Place Order - ${orderTotal.toFixed(2)}`
                )}
              </button>
            )}
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="lg:pl-8">
          <div className="bg-dark-700 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
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
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-400">
                      Size: {item.size} | Color: {item.color} | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-dark-600 pt-4">
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
              <div className="flex justify-between font-semibold text-lg pt-3 border-t border-dark-600">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;