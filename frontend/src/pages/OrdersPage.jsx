import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Package, Clock, CheckCircle, TruckIcon, XCircle } from 'lucide-react';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real app, you'd fetch from your API
    // For demo purposes, we'll use mock data
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockOrders = [
        {
          id: 'ORD-1234',
          date: '2025-05-28',
          total: 129.99,
          status: 'Delivered',
          items: [
            { id: 1, name: 'Wireless Headphones', price: 89.99, quantity: 1 },
            { id: 2, name: 'Phone Case', price: 20.00, quantity: 2 }
          ],
          shippingAddress: '123 Main St, Anytown, USA',
          paymentMethod: 'Credit Card'
        },
        {
          id: 'ORD-5678',
          date: '2025-05-15',
          total: 249.95,
          status: 'Processing',
          items: [
            { id: 3, name: 'Smart Watch', price: 199.95, quantity: 1 },
            { id: 4, name: 'Watch Band', price: 25.00, quantity: 2 }
          ],
          shippingAddress: '123 Main St, Anytown, USA',
          paymentMethod: 'PayPal'
        },
        {
          id: 'ORD-9012',
          date: '2025-04-30',
          total: 599.99,
          status: 'Shipped',
          items: [
            { id: 5, name: 'Laptop', price: 599.99, quantity: 1 }
          ],
          shippingAddress: '123 Main St, Anytown, USA',
          paymentMethod: 'Credit Card'
        }
      ];
      
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
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
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>      ) : orders.length === 0 ? (
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
      ) : (        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-dark-700 rounded-lg shadow overflow-hidden">
              <div className="bg-dark-600 px-6 py-4 border-b border-dark-500 flex justify-between items-center">                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <span className="text-gray-400 flex items-center">
                    <Calendar size={16} className="mr-1" />
                    {formatDate(order.date)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(order.status)}
                  <span className={`
                    ${order.status.toLowerCase() === 'delivered' ? 'text-green-500' : ''}
                    ${order.status.toLowerCase() === 'processing' ? 'text-yellow-500' : ''}
                    ${order.status.toLowerCase() === 'shipped' ? 'text-blue-500' : ''}
                    ${order.status.toLowerCase() === 'cancelled' ? 'text-red-500' : ''}
                    font-medium
                  `}>
                    {order.status}
                  </span>
                </div>
              </div>              <div className="px-6 py-4">
                <div className="divide-y divide-dark-500">
                  {order.items.map(item => (
                    <div key={item.id} className="py-3 flex justify-between">
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
                    <span className="text-gray-300">{order.shippingAddress}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400">Payment Method:</span>
                    <span className="text-gray-300">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-bold text-lg">Total:</span>
                    <span className="font-bold text-lg">${order.total.toFixed(2)}</span>
                  </div>
                </div>                <div className="mt-6 flex justify-end space-x-4">
                  <button className="px-4 py-2 border border-dark-500 rounded-md text-gray-300 hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800">
                    View Details
                  </button>
                  {order.status.toLowerCase() !== 'delivered' && (
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
