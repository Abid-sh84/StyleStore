import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, Database, RefreshCw } from 'lucide-react';
import { getSystemStatus, reconnectDatabase, startStatusPolling } from '../../services/systemService';

const Footer = () => {
  const [dbStatus, setDbStatus] = useState({
    connected: false,
    state: 'unknown',
    checking: true,
    host: '',
    lastError: null,
    uptime: 0
  });
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const checkSystemStatus = async () => {
      try {
        const status = await getSystemStatus();
        setDbStatus({
          connected: status.database.connected,
          state: status.database.state,
          checking: false,
          host: status.database.host || '',
          lastError: status.database.lastError,
          uptime: status.uptime
        });
      } catch (error) {
        setDbStatus({
          connected: false,
          state: 'error',
          checking: false,
          host: '',
          lastError: error.message,
          uptime: 0
        });
      }
    };

    // Initial check
    checkSystemStatus();
    
    // Start polling every 30 seconds
    const stopPolling = startStatusPolling((status) => {
      setDbStatus({
        connected: status.database.connected,
        state: status.database.state,
        checking: false,
        host: status.database.host || '',
        lastError: status.database.lastError,
        uptime: status.uptime
      });
    }, 30000);
    
    // Cleanup polling on component unmount
    return () => stopPolling();
  }, []);
  
  const handleReconnect = async () => {
    setReconnecting(true);
    try {
      const result = await reconnectDatabase();
      if (result.success) {
        // Refresh status after reconnect attempt
        const status = await getSystemStatus();
        setDbStatus({
          connected: status.database.connected,
          state: status.database.state,
          checking: false,
          host: status.database.host || '',
          lastError: status.database.lastError,
          uptime: status.uptime
        });
      } else {
        setDbStatus(prev => ({
          ...prev,
          lastError: result.error
        }));
      }
    } catch (error) {
      console.error('Failed to reconnect:', error);
    } finally {
      setReconnecting(false);
    }
  };
  
  return (
    <footer className="bg-dark-900 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">STYLESTORE</h3>
            <p className="text-gray-400 mb-4">Premium quality t-shirts for men, women and kids. Designed for comfort and style.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/products/men" className="text-gray-400 hover:text-primary-500 transition-colors">Men's T-Shirts</Link>
              </li>
              <li>
                <Link to="/products/women" className="text-gray-400 hover:text-primary-500 transition-colors">Women's T-Shirts</Link>
              </li>
              <li>
                <Link to="/products/kids" className="text-gray-400 hover:text-primary-500 transition-colors">Kids' T-Shirts</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-primary-500 transition-colors">All Products</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-500 transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-primary-500 transition-colors">FAQs</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-primary-500 transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/size-guide" className="text-gray-400 hover:text-primary-500 transition-colors">Size Guide</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-primary-500 mr-2 mt-1 flex-shrink-0" />
                <span className="text-gray-400">123 Fashion Street, Design District, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-400">support@stylestore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} STYLESTORE. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <Link to="/privacy" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">Terms of Service</Link>
              <div className="flex items-center ml-2 group relative">
                <button 
                  onClick={handleReconnect} 
                  disabled={reconnecting || dbStatus.connected}
                  className="flex items-center p-1 rounded hover:bg-dark-700"
                  title={dbStatus.connected ? 'Database connected' : 'Click to reconnect database'}
                >
                  <Database size={14} className={`mr-1 ${dbStatus.connected ? 'text-green-500' : dbStatus.checking ? 'text-yellow-500' : 'text-red-500'}`} />
                  <span className="text-xs text-gray-500">
                    {dbStatus.checking ? 'Checking DB...' : 
                     reconnecting ? 'Reconnecting...' :
                     dbStatus.connected ? 'DB: Connected' : 'DB: Offline'}
                  </span>
                  {!dbStatus.connected && !reconnecting && (
                    <RefreshCw size={12} className="ml-1 text-primary-500 hover:animate-spin" />
                  )}
                </button>
                
                {/* Tooltip with DB details */}
                <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-dark-700 rounded-md shadow-lg 
                              text-xs opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                              transition-all duration-200 z-10">
                  <p className="text-white font-medium mb-1">Database Status</p>
                  <p className="text-gray-300">State: <span className={dbStatus.connected ? 'text-green-400' : 'text-red-400'}>
                    {dbStatus.state}
                  </span></p>
                  
                  {dbStatus.host && (
                    <p className="text-gray-300">Host: <span className="text-gray-400">{dbStatus.host}</span></p>
                  )}
                  
                  {dbStatus.lastError && (
                    <p className="text-gray-300">Error: <span className="text-red-400">{dbStatus.lastError}</span></p>
                  )}
                  
                  {!dbStatus.connected && !dbStatus.checking && (
                    <p className="text-yellow-400 mt-1">Using local fallback data.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;