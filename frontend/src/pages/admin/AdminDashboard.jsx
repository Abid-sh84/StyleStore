import React from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Box, BarChart, Clipboard, Settings } from 'lucide-react';

const AdminDashboard = () => {
  // Admin menu items
  const adminMenuItems = [
    {
      title: 'Users',
      description: 'Manage users and permissions',
      icon: <Users size={24} />,
      path: '/admin/users',
      color: 'bg-primary-600 hover:bg-primary-700'
    },
    {
      title: 'Products',
      description: 'Add, edit, or remove products',
      icon: <ShoppingBag size={24} />,
      path: '/admin/products',
      color: 'bg-secondary-600 hover:bg-secondary-700'
    },
    {
      title: 'Orders',
      description: 'View and manage customer orders',
      icon: <Box size={24} />,
      path: '/admin/orders',
      color: 'bg-accent-500 hover:bg-accent-600'
    },
    {
      title: 'Analytics',
      description: 'View sales and user metrics',
      icon: <BarChart size={24} />,
      path: '/admin/analytics',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Content',
      description: 'Manage site content and pages',
      icon: <Clipboard size={24} />,
      path: '/admin/content',
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      title: 'Settings',
      description: 'Configure store settings',
      icon: <Settings size={24} />,
      path: '/admin/settings',
      color: 'bg-indigo-600 hover:bg-indigo-700'
    }
  ];
  return (
    <div className="container mx-auto p-6 pt-24">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-200">Admin Dashboard</h1>
        <p className="text-gray-400">Manage your store, products, and customers</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminMenuItems.map((item, index) => {
          // Check if the path is implemented
          const isImplemented = ['/admin/users', '/admin/products'].includes(item.path);
          
          const content = (
            <div className="flex items-center">
              <div className="rounded-full p-3 mr-4 bg-dark-600 text-white">
                {item.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-gray-200">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            </div>
          );

          return (
            <div key={index} className={`card hover:transform hover:scale-[1.02] transition-all duration-300 ${!isImplemented ? 'opacity-60' : ''}`}>
              {isImplemented ? (
                <Link to={item.path} className={`block p-6 rounded-lg ${item.color} text-white`}>
                  {content}
                </Link>
              ) : (
                <div className="p-6 rounded-lg bg-dark-600 relative cursor-not-allowed">
                  {content}
                  <div className="absolute top-2 right-2 bg-gray-800 text-xs px-2 py-1 rounded text-gray-300">
                    Coming soon
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-dark-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-dark-600 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Active Users</p>
            <p className="text-2xl font-bold text-primary-500">328</p>
          </div>
          <div className="bg-dark-600 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-secondary-500">152</p>
          </div>
          <div className="bg-dark-600 p-4 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Products</p>
            <p className="text-2xl font-bold text-accent-500">86</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
