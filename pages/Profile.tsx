import React, { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { UserCircle, Mail, Phone, Bell, BellOff, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
  preferences: {
    newsletter: boolean;
    notifications: {
      email: boolean;
      push: boolean;
    };
  };
}

const defaultPreferences = {
  newsletter: false,
  notifications: {
    email: true,
    push: true,
  },
};

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferences: defaultPreferences,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to view your profile');
        return;
      }

      // Use proper column selection to match the table structure
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, created_at, preferences')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading profile:', error);
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          const newProfile = {
            id: user.id,
            name: user.user_metadata.name || user.email?.split('@')[0] || '',
            email: user.email || '',
            phone: '',
            preferences: defaultPreferences,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const { error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile]);

          if (insertError) throw insertError;
          setProfile(newProfile as Profile);
          setFormData({
            name: newProfile.name,
            phone: newProfile.phone,
            email: newProfile.email,
            preferences: newProfile.preferences,
          });
        } else {
          throw error;
        }
      } else if (profile) {
        setProfile(profile);
        setFormData({
          name: profile.name || '',
          phone: profile.phone || '',
          email: profile.email || '',
          preferences: profile.preferences || defaultPreferences,
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          preferences: formData.preferences,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : !profile ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700">Profile not found</h2>
            <p className="text-gray-500 mt-2">Please try logging in again</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!editing}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="pl-10 w-full p-3 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!editing}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      value={new Date(profile.created_at).toLocaleDateString()}
                      disabled
                      className="pl-10 w-full p-3 border rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Preferences</h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.preferences.newsletter}
                      onChange={(e) => setFormData({
                        ...formData,
                        preferences: {
                          ...formData.preferences,
                          newsletter: e.target.checked
                        }
                      })}
                      disabled={!editing}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Mail size={20} className="text-gray-400" />
                    <span>Subscribe to newsletter</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
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
                      disabled={!editing}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <Bell size={20} className="text-gray-400" />
                    <span>Email notifications</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
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
                      disabled={!editing}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <BellOff size={20} className="text-gray-400" />
                    <span>Push notifications</span>
                  </label>
                </div>
              </div>

              {editing && (
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      loadProfile();
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-lg hover:from-teal-700 hover:to-emerald-700 transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;