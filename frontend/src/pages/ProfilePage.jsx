import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/orderService';
import { User, Mail, Phone, MapPin, Save, AlertCircle, Lock, Package, UserCog, ShoppingBag, Trash2, Calendar, Eye, EyeOff } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile, loading } = useAuth();
  const navigate = useNavigate();
  
  // Tabs for profile sections
  const [activeTab, setActiveTab] = useState('profile');
  
  // Form data state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  
  // UI states
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);
  
  // Fetch user's orders
  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);
  
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await getUserOrders();
      setOrders(data);
      setOrdersError('');
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setOrdersError('Could not load your orders. Please try again.');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Password validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // Prepare data for submission (only send password if it's been changed)
    const profileData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address
    };
    
    if (formData.password) {
      profileData.password = formData.password;
    }

    try {
      // Call the real API endpoint using the context function
      await updateProfile(profileData);
      setSuccess('Profile updated successfully');
      
      // Clear password fields after successful update
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Render the order status badge
  const renderOrderStatus = (isPaid, isDelivered) => {
    if (isDelivered) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400 border border-green-500">
          Delivered
        </span>
      );
    } else if (isPaid) {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500">
          Shipped
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500">
          Processing
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-dark-500 mb-8">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'profile'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <div className="flex items-center">
              <UserCog size={18} className="mr-2" />
              <span>Profile</span>
            </div>
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'orders'
                ? 'text-primary-400 border-b-2 border-primary-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            <div className="flex items-center">
              <ShoppingBag size={18} className="mr-2" />
              <span>Orders</span>
            </div>
          </button>
        </div>
        
        {/* Alerts */}
        {error && (
          <div className="bg-dark-600 border-l-4 border-red-500 text-red-400 p-4 mb-6 flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-dark-600 border-l-4 border-green-500 text-green-400 p-4 mb-6 flex items-center">
            <p>{success}</p>
          </div>
        )}
        
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-dark-700 rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="name" className="block text-gray-300 font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                  
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="email" className="block text-gray-300 font-medium mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                  
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="password" className="block text-gray-300 font-medium mb-2">
                    Password (Leave blank to keep current)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                  
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="confirmPassword" className="block text-gray-300 font-medium mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                  
                <div className="col-span-2 md:col-span-1">
                  <label htmlFor="phone" className="block text-gray-300 font-medium mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                  
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-gray-300 font-medium mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="block w-full pl-10 pr-3 py-2 bg-dark-600 border border-dark-500 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    ></textarea>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus:ring-offset-dark-800"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Save className="mr-2" size={20} />
                      Save Changes
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Orders Tab Content */}
        {activeTab === 'orders' && (
          <div className="bg-dark-700 rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-dark-600">
              <h2 className="text-xl font-bold flex items-center">
                <Package className="mr-2" size={20} />
                My Orders
              </h2>
            </div>
            
            {ordersLoading ? (
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : ordersError ? (
              <div className="p-8 text-center">
                <div className="text-red-400 mb-4">{ordersError}</div>
                <button 
                  onClick={fetchOrders} 
                  className="btn-secondary"
                >
                  Try Again
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-400 mb-6">You haven't placed any orders yet.</p>
                <Link to="/products" className="btn-primary inline-block">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-600">
                    <tr>
                      <th className="text-left p-4">Order ID</th>
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Total</th>
                      <th className="text-left p-4">Status</th>
                      <th className="text-center p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-600">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-dark-600/50">
                        <td className="p-4">
                          <span className="font-mono text-sm">
                            #{order._id.substring(order._id.length - 6).toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-2 text-gray-400" />
                            <span>{formatDate(order.createdAt)}</span>
                          </div>
                        </td>
                        <td className="p-4 font-medium">${order.totalPrice?.toFixed(2)}</td>
                        <td className="p-4">
                          {renderOrderStatus(order.isPaid, order.isDelivered)}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <button
                              onClick={() => navigate(`/order-summary/${order._id}`)}
                              className="p-2 text-primary-400 hover:text-primary-300"
                              title="View Order Details"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Account Deletion (could be expanded in the future) */}
        <div className="mt-8 p-6 bg-dark-700 rounded-lg border border-dark-600">
          <h3 className="text-lg font-medium mb-4">Account Settings</h3>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-red-400 font-medium">Delete Account</h4>
              <p className="text-sm text-gray-400">
                Permanently delete your account and all associated data
              </p>
            </div>
            <button 
              className="px-4 py-2 border border-red-500 text-red-400 rounded-md hover:bg-red-500/10"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  // Account deletion logic would go here
                  alert('This feature is not implemented yet.');
                }
              }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
