import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setCurrentUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Set auth header when token changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [currentUser]);


  const login = async (email) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', { email: email, role: 'user' });
      const { token, ...userData } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setCurrentUser(userData);
      
      return userData;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear state
    setCurrentUser(null);
    setError(null);
    
    // Navigate to home
    navigate('/');
  };

  const updateProfile = async (userData) => {
    try {
      setError(null);
      
      // Validate addresses if present
      if (userData.addresses && Array.isArray(userData.addresses)) {
        userData.addresses = userData.addresses.map(address => ({
          street: address.street || '',
          city: address.city || '',
          state: address.state || '',
          zipCode: address.zipCode || '',
          country: address.country || ''
        }));
      }

      const response = await api.put('/auth/profile', userData);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Update state
      setCurrentUser(response.data);
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 