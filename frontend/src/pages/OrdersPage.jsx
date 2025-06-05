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
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      {error && (
        <div className="bg-red-900/30 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
          <p>{error}</p>
          <button 
            onClick={fetchOrders} 
            className="mt-2 text-sm text-primary-400 hover:text-primary-300"
          >
            Try again
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-dark-700 rounded-lg shadow p-8 text-center">
          <Package className="mx-auto text-gray-400" size={48} />
          <h2 className="text-xl font-semibold mt-4">No Orders Found</h2>
          <p className="text-gray-400 mt-2">You haven't placed any orders yet.</p>
          <button 
            onClick={() => window.location.href = '/products'}
            className="mt-6 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
          >
            Browse Products
          </button>
        </div>
      ) : (        <div className="space-y-6">          {orders.map(order => (
            <div key={order._id} className="bg-dark-700 rounded-lg shadow overflow-hidden">
              <div className="bg-dark-600 px-6 py-4 border-b border-dark-500 flex justify-between items-center">                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Order #{order._id.substring(0, 8)}</h2>
                  <span className="text-gray-400 flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.isDelivered ? 'delivered' : order.isPaid ? 'processing' : 'pending')}
                  <span className={`
                    ${order.isDelivered ? 'text-green-500' : ''}
                    ${!order.isDelivered && order.isPaid ? 'text-yellow-500' : ''}
                    ${!order.isPaid ? 'text-red-500' : ''}
                    font-medium
                  `}>
                    {order.isDelivered ? 'Delivered' : order.isPaid ? 'Processing' : 'Payment Pending'}
                  </span>
                </div>
              </div>              <div className="px-6 py-4">
                <div className="divide-y divide-dark-500">
                  {order.orderItems.map(item => (
                    <div key={item.product} className="py-3 flex justify-between">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>                <div className="mt-4 pt-4 border-t border-dark-500">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Shipping Address:</span>
                    <span className="text-gray-300">
                      {`${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-gray-300">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </div>                <div className="mt-6 flex justify-end space-x-4">
                  <button 
                    className="px-4 py-2 border border-dark-500 rounded-md text-gray-300 hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800"
                    onClick={() => navigate('/order-summary', { state: { order } })}
                  >
                    View Details
                  </button>
                  {!order.isDelivered && !order.isPaid && (
                    <button className="px-4 py-2 border border-red-700 text-red-400 rounded-md hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-dark-800">
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
  );
};

export default OrdersPage;
