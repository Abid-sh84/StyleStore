import React from 'react';

const AdminAnalyticsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Total Sales</h2>
          <p className="text-3xl font-bold text-green-600">$12,340</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Total Orders</h2>
          <p className="text-3xl font-bold text-blue-600">1,234</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Active Users</h2>
          <p className="text-3xl font-bold text-purple-600">328</p>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Sales Overview</h2>
        <div className="h-48 flex items-center justify-center text-gray-400">
          {/* Placeholder for chart */}
          <span>Chart coming soon...</span>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <ul className="text-gray-700">
          <li>- User John placed an order</li>
          <li>- Product "Sneakers" was added</li>
          <li>- Order #1234 marked as delivered</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
