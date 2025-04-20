import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  InformationCircleIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7.5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                CoolComfort
              </span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <HomeIcon className="h-5 w-5 mr-2" />
                Home
              </Link>
              <Link
                to="/products"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/products') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <CubeIcon className="h-5 w-5 mr-2" />
                Products
              </Link>
              <Link
                to="/about"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/about') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <InformationCircleIcon className="h-5 w-5 mr-2" />
                About
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/contact') 
                    ? 'bg-indigo-50 text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
                }`}
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                Contact
              </Link>
            </div>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <Link
              to="/cart"
              className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
            >
              <ShoppingCartIcon className="h-6 w-6" />
            </Link>
            {currentUser ? (
              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className="relative group" onClick={() => setIsProfileOpen(!isProfileOpen)}>
                    <div className="flex flex-col">
                      <button
                        className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                      >
                        <UserIcon className="h-6 w-6" />
                      </button>
                      {isProfileOpen && <div className="absolute right-0 mt-10 pt-4 w-48 bg-white rounded-lg shadow-xl py-1 z-50 duration-200">
                        <div className="absolute -top-4 left-0 right-0 h-4"></div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <div className="flex items-center">
                            {/* <ClipboardDocumentListIcon className="h-4 w-4 mr-2" /> */}
                            Orders
                          </div>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          Logout
                        </button>
                      </div>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                >
                  Login
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Home
            </Link>
            <Link
              to="/products"
              className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/products') 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <CubeIcon className="h-5 w-5 mr-2" />
              Products
            </Link>
            <Link
              to="/about"
              className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/about') 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <InformationCircleIcon className="h-5 w-5 mr-2" />
              About
            </Link>
            <Link
              to="/contact"
              className={`flex items-center px-3 py-2 rounded-lg text-base font-medium ${
                isActive('/contact') 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Contact
            </Link>
            {currentUser ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Profile
                </Link>
                <Link
                  to="/orders"
                  className="flex items-center px-3 py-2 rounded-lg text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  {/* <ClipboardDocumentListIcon className="h-5 w-5 mr-2" /> */}
                  Ordersawfvc
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-3 py-2 rounded-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 