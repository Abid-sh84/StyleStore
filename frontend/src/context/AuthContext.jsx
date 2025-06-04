import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setLoading(false);
      } catch (error) {
        console.error('Authentication check failed:', error);
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await api.post('/users/register', userData);
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw error;
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await api.post('/users/login', credentials);
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/users/logout');
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const response = await api.put('/users/profile', userData);
      
      if (response.data.user) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setLoading(false);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      setLoading(false);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};