/**
 * QR Code Service
 * Handles all QR code related API calls
 */
import api from './api';

const QRService = {
  /**
   * Get current user's QR code
   * @returns {Promise} - QR code data including base64 image and token
   */
  getMyQRCode: async () => {
    const response = await api.get('/qr/my-qr');
    return response.data;
  },

  /**
   * Get QR code for a specific user (admin only)
   * @param {number} userId - User ID
   * @returns {Promise} - QR code data
   */
  getUserQRCode: async (userId) => {
    const response = await api.get(`/qr/user/${userId}`);
    return response.data;
  },

  /**
   * Validate a QR code token
   * @param {string} token - QR code token to validate
   * @returns {Promise} - Validation result with user info if valid
   */
  validateQRToken: async (token) => {
    const response = await api.post('/qr/validate', null, {
      params: { token },
    });
    return response.data;
  },

  /**
   * Refresh current user's QR code token
   * @returns {Promise} - Confirmation message and new token
   */
  refreshQRCode: async () => {
    const response = await api.post('/qr/refresh');
    return response.data;
  },
};

export default QRService;