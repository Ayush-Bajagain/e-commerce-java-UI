import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, UserCircle, Settings, Package, Home, Grid, Info, Phone } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileProfileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(event.target)) {
        setIsMobileProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out',
        timer: 2000,
        showConfirmButton: false,
      });
      navigate('/login');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Logout Failed',
        text: error.message || 'Something went wrong',
      });
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-white hover:text-primary-100 transition-colors duration-200">
              E-Commerce
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className={`relative text-sm font-medium px-3 py-2 transition-colors duration-200 ${
                  isActive('/')
                    ? 'text-white'
                    : 'text-primary-100 hover:text-white'
                }`}
              >
                Home
                {isActive('/') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                )}
              </Link>
              <Link
                to="/products"
                className={`relative text-sm font-medium px-3 py-2 transition-colors duration-200 ${
                  isActive('/products')
                    ? 'text-white'
                    : 'text-primary-100 hover:text-white'
                }`}
              >
                Products
                {isActive('/products') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                )}
              </Link>
              <Link
                to="/about"
                className={`relative text-sm font-medium px-3 py-2 transition-colors duration-200 ${
                  isActive('/about')
                    ? 'text-white'
                    : 'text-primary-100 hover:text-white'
                }`}
              >
                About
                {isActive('/about') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                )}
              </Link>
              <Link
                to="/contact"
                className={`relative text-sm font-medium px-3 py-2 transition-colors duration-200 ${
                  isActive('/contact')
                    ? 'text-white'
                    : 'text-primary-100 hover:text-white'
                }`}
              >
                Contact
                {isActive('/contact') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white transform scale-x-100 transition-transform duration-200"></span>
                )}
              </Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full transition-colors duration-200 ${
                  isActive('/cart')
                    ? 'text-white bg-primary-500'
                    : 'text-primary-100 hover:text-white hover:bg-primary-500'
                }`}
              >
                <ShoppingCart className="h-6 w-6" />
                {isActive('/cart') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                )}
              </Link>

              {/* Profile Icon with Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`relative p-2 rounded-full transition-colors duration-200 ${
                    isProfileOpen
                      ? 'text-white bg-primary-500'
                      : 'text-primary-100 hover:text-white hover:bg-primary-500'
                  }`}
                >
                  <User className="h-6 w-6" />
                  {isProfileOpen && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircle className="h-5 w-5 mr-2" />
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Package className="h-5 w-5 mr-2" />
                          Orders
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings className="h-5 w-5 mr-2" />
                          Settings
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setIsProfileOpen(false);
                            handleLogout();
                          }}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircle className="h-5 w-5 mr-2" />
                          Sign In
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <UserCircle className="h-5 w-5 mr-2" />
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-primary-700 border-t border-primary-500 z-50 shadow-lg">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center relative ${
              isActive('/') ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs mt-1">Home</span>
            {isActive('/') && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
            )}
          </Link>
          <Link
            to="/products"
            className={`flex flex-col items-center relative ${
              isActive('/products') ? 'text-white' : 'text-primary-100'
            }`}
          >
            <Grid className="h-6 w-6" />
            <span className="text-xs mt-1">Products</span>
            {isActive('/products') && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
            )}
          </Link>
          <Link
            to="/cart"
            className={`flex flex-col items-center relative ${
              isActive('/cart') ? 'text-white' : 'text-primary-100'
            }`}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="text-xs mt-1">Cart</span>
            {isActive('/cart') && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileProfileOpen(true)}
            className={`flex flex-col items-center relative ${
              isActive('/profile') ? 'text-white' : 'text-primary-100'
            }`}
          >
            <User className="h-6 w-6" />
            <span className="text-xs mt-1">Profile</span>
            {isActive('/profile') && (
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Profile Modal */}
      {isMobileProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 md:hidden">
          <div
            ref={mobileProfileRef}
            className="bg-white w-full rounded-t-2xl p-6 transform transition-transform duration-300 ease-in-out"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={() => setIsMobileProfileOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isAuthenticated ? (
              <div className="space-y-4">
                <Link
                  to="/profile"
                  className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                  onClick={() => setIsMobileProfileOpen(false)}
                >
                  <UserCircle className="h-6 w-6 mr-3" />
                  <span>My Profile</span>
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                  onClick={() => setIsMobileProfileOpen(false)}
                >
                  <Package className="h-6 w-6 mr-3" />
                  <span>My Orders</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                  onClick={() => setIsMobileProfileOpen(false)}
                >
                  <Settings className="h-6 w-6 mr-3" />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={() => {
                    setIsMobileProfileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-6 w-6 mr-3" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Link
                  to="/login"
                  className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                  onClick={() => setIsMobileProfileOpen(false)}
                >
                  <UserCircle className="h-6 w-6 mr-3" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center p-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 rounded-lg"
                  onClick={() => setIsMobileProfileOpen(false)}
                >
                  <UserCircle className="h-6 w-6 mr-3" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add padding to the bottom of the page for mobile navigation */}
      <div className="md:hidden h-16"></div>
    </>
  );
};

export default Navbar; 