import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Calendar, Package, Clock, CheckCircle, TruckIcon, XCircle } from 'lucide-react';
import { getUserOrders } from '../services/orderService';

const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      const userOrders = await getUserOrders();
      setOrders(userOrders);
      setError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'processing':
        return <Clock className="text-yellow-500" size={20} />;
      case 'shipped':
        return <TruckIcon className="text-blue-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package size={20} />;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6">
            <p>{error}</p>
            <button 
              onClick={fetchOrders} 
              className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Try again
            </button>
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-orange-100">
            <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="text-orange-500" size={48} />
            </div>
            <h2 className="text-2xl font-bold mt-4 text-gray-900">No Orders Found</h2>
            <p className="text-gray-600 mt-2 mb-6">You haven't placed any orders yet. Start exploring our delicious menu!</p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Browse Dishes
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-orange-100">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 px-6 py-4 border-b border-orange-100 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-lg font-bold text-gray-900">Order #{order._id.substring(0, 8)}</h2>
                    <span className="text-gray-600 flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending')}
                    <span className={`font-semibold ${
                      order.isDelivered ? 'text-green-600' : 
                      !order.isDelivered && order.isPaid ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Payment Pending'}
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4">
                  <div className="divide-y divide-orange-100">
                    {order.orderItems.map(item => (
                      <div key={item.product} className="py-3 flex justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-gray-900">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-orange-100">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Shipping Address:</span>
                      <span className="text-gray-900 font-medium">
                        {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600 font-medium">Payment Method:</span>
                      <span className="text-gray-900 font-medium">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center mt-4 bg-orange-50 p-3 rounded-xl">
                      <span className="font-bold text-lg text-gray-900">Total:</span>
                      <span className="font-bold text-lg text-orange-600">${order.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-4">
                    <button 
                      className="px-6 py-2 border border-orange-200 rounded-xl text-gray-700 hover:bg-orange-50 font-medium transition-colors"
                      onClick={() => navigate('/order-summary', { state: { order } })}
                    >
                      View Details
                    </button>
                    {!order.isDelivered && !order.isPaid && (
                      <button className="px-6 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-medium transition-colors">
                        Cancel Order
                      </button>
                    )}
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

export default OrdersPage;
