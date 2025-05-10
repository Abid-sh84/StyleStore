import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, Bell, BellOff } from 'lucide-react';
import { UserProfile } from '../types';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface UserProfileProps {
  userId: string;
  onClose: () => void;
}

export const UserProfileComponent: React.FC<UserProfileProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    preferences: {
      newsletter: false,
      notifications: {
        email: true,
        push: true
      }
    }
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await api.getUserProfile();
      setProfile(data);
      if (data) {
        setFormData({
          name: data.name,
          phone: data.phone || '',
          preferences: data.preferences
        });
      }
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updatedProfile = await api.updateUserProfile({
        id: userId,
        ...formData
      });
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Profile Settings
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Preferences
            </label>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.preferences.newsletter}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: {
                    ...formData.preferences,
                    newsletter: e.target.checked
                  }
                })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                disabled={!isEditing}
              />
              <label htmlFor="newsletter" className="flex items-center gap-2">
                <Mail size={20} className="text-gray-400" />
                <span>Subscribe to newsletter</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="emailNotif"
                checked={formData.preferences.notifications.email}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: {
                    ...formData.preferences,
                    notifications: {
                      ...formData.preferences.notifications,
                      email: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                disabled={!isEditing}
              />
              <label htmlFor="emailNotif" className="flex items-center gap-2">
                <Bell size={20} className="text-gray-400" />
                <span>Email notifications</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pushNotif"
                checked={formData.preferences.notifications.push}
                onChange={(e) => setFormData({
                  ...formData,
                  preferences: {
                    ...formData.preferences,
                    notifications: {
                      ...formData.preferences.notifications,
                      push: e.target.checked
                    }
                  }
                })}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                disabled={!isEditing}
              />
              <label htmlFor="pushNotif" className="flex items-center gap-2">
                <BellOff size={20} className="text-gray-400" />
                <span>Push notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setFormData({
                      name: profile.name,
                      phone: profile.phone || '',
                      preferences: profile.preferences
                    });
                  }
                }}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 active:scale-95"
            >
              Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};