import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Lock, MapPin } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const profileDropdownRef = useRef(null);
  const cartContext = useCart();
  const cart = cartContext?.cart || { items: [] };
  const { user, logout } = useAuth() || { user: null, logout: () => {} };
  const navigate = useNavigate();
  const location = window.location.pathname;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileDropdown = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape' && isProfileOpen) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isProfileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
    setSearchQuery('');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-orange-100' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo} 
              alt="QUICKBITE" 
              className="h-10 md:h-14 w-auto transform hover:opacity-90 transition-all duration-200" 
              style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.1))' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products/pizza" className="text-gray-700 hover:text-orange-600 transition-colors">Pizza</Link>
            <Link to="/products/burgers" className="text-gray-700 hover:text-orange-600 transition-colors">Burgers</Link>
            <Link to="/products/chinese" className="text-gray-700 hover:text-orange-600 transition-colors">Chinese</Link>
            <Link to="/products/indian" className="text-gray-700 hover:text-orange-600 transition-colors">Indian</Link>
            <Link to="/products/desserts" className="text-gray-700 hover:text-orange-600 transition-colors">Desserts</Link>
          </nav>

          {/* Search, Cart, User */}
          <div className="hidden md:flex items-center space-x-6">
            <form onSubmit={handleSearch} className="relative">              <input 
                type="text" 
                placeholder="Search for food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1 px-3 pr-8 rounded-full bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 w-40 lg:w-60 text-gray-900"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600">
                <Search size={16} />
              </button>
            </form>

            <Link to="/cart" className="text-gray-700 hover:text-orange-600 relative">
              <ShoppingBag size={22} />
              {cart?.items?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.items.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative" ref={profileDropdownRef}>
                <button 
                  className="text-gray-700 hover:text-orange-600 flex items-center gap-1"
                  onClick={toggleProfileDropdown}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  aria-label="Profile menu"
                >
                  <User size={22} />
                  <svg 
                    className={`w-4 h-4 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProfileOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white border border-orange-200 rounded-md shadow-lg animate-slide-down" 
                    role="menu" 
                    aria-orientation="vertical"
                  >
                    <div className="py-2 px-4 border-b border-orange-100 text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                    <Link 
                      to="/profile" 
                      className={`block px-4 py-2 text-sm hover:bg-orange-50 text-gray-700 hover:text-orange-600 ${location === '/profile' ? 'bg-orange-50 text-primary-500' : ''}`} 
                      onClick={() => setIsProfileOpen(false)}
                      role="menuitem"
                    >
                      My Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className={`block px-4 py-2 text-sm hover:bg-orange-50 text-gray-700 hover:text-orange-600 ${location === '/orders' ? 'bg-orange-50 text-primary-500' : ''}`} 
                      onClick={() => setIsProfileOpen(false)}
                      role="menuitem"
                    >
                      My Orders
                    </Link>                    {user.isAdmin && (
                      <Link 
                        to="/admin" 
                        className={`block px-4 py-2 text-sm hover:bg-orange-50 ${location.startsWith('/admin') ? 'bg-orange-50 text-primary-500' : 'text-primary-600'}`}
                        onClick={() => setIsProfileOpen(false)}
                        role="menuitem"
                      >
                        <span className="flex items-center">
                          <Lock size={14} className="mr-1" />
                          Go to Admin Panel
                        </span>
                      </Link>
                    )}
                    {/* <Link 
                      to="/api-test" 
                      className={`block px-4 py-2 text-sm hover:bg-dark-700 ${location === '/api-test' ? 'bg-dark-700 text-primary-500' : ''}`}
                      onClick={() => setIsProfileOpen(false)}
                      role="menuitem"
                    >
                      API Test
                    </Link> */}
                    <button 
                      onClick={() => { handleLogout(); setIsProfileOpen(false); }} 
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-orange-50 text-red-500 hover:text-red-600"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-orange-600">
                <User size={22} />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 hover:text-orange-600" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm py-4 px-4 animate-slide-down border-t border-orange-100 shadow-lg">
          <form onSubmit={handleSearch} className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search for food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-3 pr-8 rounded-md bg-orange-50 border border-orange-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 text-gray-900"
            />
            <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <Search size={18} />
            </button>
          </form>

          <nav className="flex flex-col space-y-3">
            <Link to="/products/pizza" className="text-gray-700 hover:text-orange-600 py-2" onClick={toggleMenu}>Pizza</Link>
            <Link to="/products/burgers" className="text-gray-700 hover:text-orange-600 py-2" onClick={toggleMenu}>Burgers</Link>
            <Link to="/products/chinese" className="text-gray-700 hover:text-orange-600 py-2" onClick={toggleMenu}>Chinese</Link>
            <Link to="/products/indian" className="text-gray-700 hover:text-orange-600 py-2" onClick={toggleMenu}>Indian</Link>
            <Link to="/products/desserts" className="text-gray-700 hover:text-orange-600 py-2" onClick={toggleMenu}>Desserts</Link>
            <Link to="/cart" className="text-gray-700 hover:text-orange-600 py-2 flex items-center" onClick={toggleMenu}>
              <ShoppingBag size={18} className="mr-2" />
              Your Order {cart?.items?.length > 0 && `(${cart.items.reduce((total, item) => total + item.quantity, 0)})`}
            </Link>
            
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-orange-600 py-2 flex items-center" onClick={toggleMenu}>
                  <User size={18} className="mr-2" />
                  My Profile
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-orange-600 py-2" onClick={toggleMenu}>My Orders</Link>                {user.isAdmin && (
                  <Link to="/admin" className="text-primary-600 hover:text-primary-700 py-2 flex items-center" onClick={toggleMenu}>
                    <Lock size={16} className="mr-2" />
                    Go to Admin Panel
                  </Link>
                )}
                {/* <Link to="/api-test" className="text-gray-300 py-2" onClick={toggleMenu}>API Test</Link> */}
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="text-red-500 hover:text-red-600 py-2 text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" className="text-gray-700 hover:text-orange-600 py-2 flex items-center" onClick={toggleMenu}>
                <User size={18} className="mr-2" />
                Login / Register
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;