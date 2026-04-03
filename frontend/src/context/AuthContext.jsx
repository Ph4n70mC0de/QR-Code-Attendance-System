/* eslint-disable react-refresh/only-export-components */
/**
 * Authentication Context
 * Provides global authentication state management
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext(null);

/**
 * Auth Provider Component
 * Wraps the application to provide authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setTokenState] = useState(localStorage.getItem('token'));

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const userData = await AuthService.getCurrentUser();
          setUser(userData);
          setTokenState(storedToken);
        } catch {
          // Token invalid, clear stored data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setTokenState(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Login result
   */
  const login = useCallback(async (email, password) => {
    try {
      const data = await AuthService.login(email, password);
      
      // Store token
      AuthService.setToken(data.access_token);
      setTokenState(data.access_token);

      // Fetch and store user data
      const userData = await AuthService.getCurrentUser();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setTokenState(null);
  }, []);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  const register = useCallback(async (userData) => {
    try {
      await AuthService.register(userData);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      };
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };
export default AuthContext;
