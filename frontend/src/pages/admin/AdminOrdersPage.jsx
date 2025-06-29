import { useState, useEffect } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import { getOrders, updateOrderStatus } from '../../services/orderService';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch orders');
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh orders list
    } catch (error) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Paid</th>
              <th className="px-4 py-3 text-left">Delivered</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{order._id}</td>
                <td className="px-4 py-3">{order.user?.name || 'N/A'}</td>
                <td className="px-4 py-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">${order.totalPrice}</td>
                <td className="px-4 py-3">
                  {order.isPaid ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  {order.isDelivered ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {!order.isDelivered && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Mark Delivered
                      </button>
                    )}
                    {!order.isPaid && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'paid')}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
