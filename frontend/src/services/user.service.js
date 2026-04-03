/**
 * User Service
 * Handles all user management API calls
 */
import api from './api';

const UserService = {
  /**
   * Get list of users with optional filtering
   * @param {Object} params - Query parameters
   * @returns {Promise} - List of users
   */
  getUsers: async (params = {}) => {
    const response = await api.get('/users/', { params });
    return response.data;
  },

  /**
   * Get a specific user by ID
   * @param {number} userId - User ID
   * @returns {Promise} - User data
   */
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Create a new user
   * @param {Object} userData - User creation data
   * @returns {Promise} - Created user data
   */
  createUser: async (userData) => {
    const response = await api.post('/users/', userData);
    return response.data;
  },

  /**
   * Update a user's information
   * @param {number} userId - User ID
   * @param {Object} userData - User update data
   * @returns {Promise} - Updated user data
   */
  updateUser: async (userId, userData) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },

  /**
   * Delete a user
   * @param {number} userId - User ID
   * @returns {Promise} - Empty response
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Refresh a user's QR code token
   * @param {number} userId - User ID
   * @returns {Promise} - New QR token
   */
  refreshUserQR: async (userId) => {
    const response = await api.post(`/users/${userId}/refresh-qr`);
    return response.data;
  },
};

export default UserService;