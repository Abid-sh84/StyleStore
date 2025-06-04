import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Mail, Lock, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };
  
  // For demo purposes - use mock login
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setEmail('demo@example.com');
    setPassword('password123');
    
    // Simulate login with mock credentials
    setTimeout(() => {
      const mockUser = {
        id: 'demo123',
        name: 'Demo User',
        email: 'demo@example.com',
        isAdmin: false
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      window.location.href = from;
    }, 1000);
  };
  
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto">
        <div className="bg-dark-700 rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
          
          {error && (
            <div className="bg-red-900/30 border border-red-500 text-red-300 px-4 py-3 rounded mb-6 flex items-start">
              <AlertCircle size={20} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input pl-10"
                  placeholder="your.email@example.com"
                />
                <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="form-label">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input pl-10"
                  placeholder="••••••••"
                />
                <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {loading ? (
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
              ) : (
                <>
                  Login
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
            
            {/* <button
              type="button"
              onClick={handleDemoLogin}
              className="btn-outline w-full mt-3"
            >
              Demo Login
            </button> */}
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account? 
              <Link to="/register" className="text-primary-400 hover:text-primary-300 ml-1">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;