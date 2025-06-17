import React, { useState, useEffect } from 'react';
import { updateUser } from '../../services/userService';
import { Check, AlertCircle } from 'lucide-react';

const UserForm = ({ user, onClose, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    isAdmin: false,
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        isAdmin: user.isAdmin || false,
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          postalCode: user.address?.postalCode || '',
          country: user.address?.country || '',
        },
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested fields (address)
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Only include non-empty address fields
      const addressFields = {};
      Object.entries(formData.address).forEach(([key, value]) => {
        if (value) addressFields[key] = value;
      });

      const userData = {
        name: formData.name,
        email: formData.email,
        isAdmin: formData.isAdmin,
        phone: formData.phone || undefined,
        address: Object.keys(addressFields).length > 0 ? addressFields : undefined,
      };

      const updatedUser = await updateUser(user._id, userData);
      setSuccess(true);
      
      // Notify parent component about the update
      if (onUserUpdated) {
        onUserUpdated(updatedUser);
      }

      // Close after 1 second
      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-dark-700 p-6 rounded shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-200">
        {user ? `Edit User: ${user.name}` : 'Add User'}
      </h3>

      {error && (
        <div className="bg-red-900/30 text-red-400 p-3 rounded mb-4 flex items-center" role="alert">
          <AlertCircle size={18} className="mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 text-green-400 p-3 rounded mb-4 flex items-center" role="alert">
          <Check size={18} className="mr-2" />
          User updated successfully!
        </div>
      )}      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        {/* Is Admin */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            name="isAdmin"
            id="isAdmin"
            checked={formData.isAdmin}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 rounded bg-dark-600 border-dark-500 focus:ring-primary-500"
          />
          <label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-300">
            Administrator
          </label>
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="form-label">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
          />
        </div>        {/* Address Section */}
        <div className="mb-4 border-t border-dark-600 pt-4">
          <h4 className="font-medium mb-2 text-gray-300">Address (optional)</h4>
          
          {/* Street */}
          <div className="mb-3">
            <label htmlFor="address.street" className="form-label">
              Street
            </label>
            <input
              type="text"
              name="address.street"
              id="address.street"
              value={formData.address.street}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* City & State row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="address.city" className="form-label">
                City
              </label>
              <input
                type="text"
                name="address.city"
                id="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="address.state" className="form-label">
                State
              </label>
              <input
                type="text"
                name="address.state"
                id="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>

          {/* Postal Code & Country row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="address.postalCode" className="form-label">
                Postal Code
              </label>
              <input
                type="text"
                name="address.postalCode"
                id="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div>
              <label htmlFor="address.country" className="form-label">
                Country
              </label>
              <input
                type="text"
                name="address.country"
                id="address.country"
                value={formData.address.country}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
        </div>        {/* Action buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2 flex items-center justify-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
