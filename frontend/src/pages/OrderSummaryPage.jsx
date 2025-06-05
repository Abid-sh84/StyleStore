import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowLeft, Home, Calendar, ShoppingBag } from 'lucide-react';
import { getOrderById } from '../services/orderService';

const OrderSummaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(location.state?.order || null);
  
  // Get orderId from URL if present (for direct access)
  const { orderId } = useParams();
  
  // Fetch order if not available in location state
  useEffect(() => {
    const fetchOrderIfNeeded = async () => {
      // If we already have the order or don't have an ID, skip
      if (orderData || (!orderId && !location.state?.orderId)) return;
      
      setLoading(true);
      try {
        const id = orderId || location.state?.orderId;
        const fetchedOrder = await getOrderById(id);
        setOrderData(fetchedOrder);
        setError('');
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Could not load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderIfNeeded();
  }, [orderId, location.state, orderData]);
  
  // Use the fetched order data or the one from location state
  const order = orderData;

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-dark-700 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            className="btn-primary flex items-center justify-center mx-auto" 
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-dark-700 rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <Package className="mx-auto text-gray-400 mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
          <p className="text-gray-400 mb-6">We couldn't find any order information to display.</p>
          <button 
            className="btn-primary flex items-center justify-center mx-auto" 
            onClick={() => navigate('/')}
          >
            <Home size={18} className="mr-2" />
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center text-primary-400 hover:text-primary-300"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="max-w-2xl mx-auto bg-dark-700 rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-dark-600 p-6 border-b border-dark-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
              <p className="text-gray-400 flex items-center">
                <Calendar size={16} className="mr-2" />
                {formatDate(order.createdAt || new Date())}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500">
              <CheckCircle size={16} className="text-primary-500 mr-2" />
              <span className="text-primary-400 font-medium">
                {order.isPaid ? 'Paid' : 'Pending Payment'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Order ID</h3>
                <p className="font-medium">{order._id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Payment Method</h3>
                <p>{order.paymentMethod || 'Credit Card'}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">Shipping Address</h3>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.postalCode || ''}</p>
              <p>{order.shippingAddress?.country}</p>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="mt-8">
            <h3 className="font-medium mb-4 flex items-center">
              <ShoppingBag size={18} className="mr-2 text-primary-500" />
              Order Items
            </h3>
            
            <div className="bg-dark-600 rounded-lg overflow-hidden">
              {order.orderItems?.map((item, index) => (
                <div 
                  key={item.product} 
                  className={`p-4 flex items-center ${
                    index < order.orderItems.length - 1 ? 'border-b border-dark-500' : ''
                  }`}
                >
                  <div className="h-16 w-16 bg-dark-500 rounded overflow-hidden mr-4 flex-shrink-0">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity} x ${item.price?.toFixed(2)}
                      </p>
                      <p className="font-medium">${(item.quantity * item.price)?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="mt-6 bg-dark-600 rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span>${order.itemsPrice?.toFixed(2) || order.totalPrice?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span>${order.shippingPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span>${order.taxPrice?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dark-500 font-semibold">
                <span>Total</span>
                <span>${order.totalPrice?.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="mt-8">
            <button 
              className="btn-primary w-full flex items-center justify-center" 
              onClick={() => navigate('/orders')}
            >
              <ArrowLeft size={18} className="mr-2" />
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>  );
};

export default OrderSummaryPage;
