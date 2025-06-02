import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, UserCircle, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            E-Commerce
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link to="/products" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link to="/cart" className="text-gray-600 hover:text-gray-900">
              <ShoppingCart className="h-6 w-6" />
            </Link>

            {/* Profile Icon with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <User className="h-6 w-6" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCircle className="h-5 w-5 mr-2" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="h-5 w-5 mr-2" />
                        Settings
                      </Link>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <UserCircle className="h-5 w-5 mr-2" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
  );
};

export default Navbar; 