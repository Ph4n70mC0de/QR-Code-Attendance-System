/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
import api from './api';

const AuthService = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Created user data
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Access token and token type
   */
  login: async (email, password) => {
    // OAuth2 password flow requires form data
    const formData = new FormData();
    formData.append('username', email); // OAuth2 uses 'username' field for email
    formData.append('password', password);

    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Get current user information
   * @returns {Promise} - Current user data
   */
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Logout user (client-side only - clears stored credentials)
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Set authentication token
   * @param {string} token - JWT token
   */
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  /**
   * Get stored token
   * @returns {string|null} - Stored JWT token
   */
  getToken: () => {
    return localStorage.getItem('token');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} - True if authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

export default AuthService;