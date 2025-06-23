import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllOrders, 
  updateOrderToDelivered, 
  cancelOrder,
  updateOrderStatus 
} from '../../services/orderService';
import Loader from '../../components/common/Loader';
import { 
  ArrowLeft, 
  ExternalLink, 
  Eye
} from 'lucide-react';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to format price
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const OrderStatusBadge = ({ status, isPaid, isDelivered }) => {
  if (status === 'Cancelled') {
    return <span className="px-4 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Cancelled</span>;
  }
  
  if (!isPaid) {
    return <span className="px-4 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">Not Paid</span>;
  } else if (!isDelivered) {
    if (status === 'Shipped') {
      return <span className="px-4 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">Shipped</span>;
    }
    return <span className="px-4 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">Processing</span>;
  } else {
    return <span className="px-4 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">Completed</span>;
  }
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getAllOrders();
      setOrders(data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      setActionInProgress(orderId);
      await updateOrderToDelivered(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { 
                ...order, 
                isDelivered: true, 
                deliveredAt: new Date().toISOString(),
                status: 'Delivered'
              }
            : order
        )
      );
    } catch (err) {
      console.error('Failed to mark order as delivered:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        setActionInProgress(orderId);
        await cancelOrder(orderId);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId
              ? { 
                  ...order, 
                  status: 'Cancelled',
                  cancelledAt: new Date().toISOString()
                }
              : order
          )
        );
      } catch (err) {
        console.error('Failed to cancel order:', err);
        setError('Failed to cancel order. Please try again.');
      } finally {
        setActionInProgress(null);
      }
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setActionInProgress(orderId);
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId
            ? { ...order, status: newStatus }
            : order
        )
      );
    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('Failed to update order status. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
        >
          <ArrowLeft size={18} className="mr-1" />
          <span>Back to Dashboard</span>
        </Link>
        
        <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>

        {error && (
          <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {order._id.substring(order._id.length - 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white">{order.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-gray-400">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <OrderStatusBadge 
                          isPaid={order.isPaid} 
                          isDelivered={order.isDelivered}
                          status={order.status || 'Processing'} 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <Link
                            to={`/orders/${order._id}`}
                            className="inline-flex items-center px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </Link>
                          
                          {order.isPaid && !order.isDelivered && order.status !== 'Cancelled' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'Shipped')}
                                disabled={actionInProgress === order._id}
                                className="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm"
                              >
                                Ship
                              </button>
                              
                              <button
                                onClick={() => handleMarkDelivered(order._id)}
                                disabled={actionInProgress === order._id}
                                className="px-3 py-1 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm"
                              >
                                Deliver
                              </button>
                              
                              <button
                                onClick={() => handleCancelOrder(order._id)}
                                disabled={actionInProgress === order._id}
                                className="px-3 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          
                          {actionInProgress === order._id && (
                            <span className="ml-2">
                              <Loader size="small" />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
