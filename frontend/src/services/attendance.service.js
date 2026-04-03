/**
 * Attendance Service
 * Handles all attendance related API calls
 */
import api from './api';

const AttendanceService = {
  /**
   * Record attendance by scanning a QR code
   * @param {Object} attendanceData - Attendance data including QR token and status
   * @param {number} sessionId - Optional session ID
   * @returns {Promise} - Created attendance record
   */
  scanAttendance: async (attendanceData, sessionId = null) => {
    const response = await api.post('/attendance/scan', attendanceData, {
      params: { session_id: sessionId },
    });
    return response.data;
  },

  /**
   * Get attendance records
   * For regular users, returns their own attendance.
   * For admins/instructors, returns all attendance records.
   * @param {Object} params - Query parameters (skip, limit)
   * @returns {Promise} - List of attendance records
   */
  getAttendance: async (params = {}) => {
    const response = await api.get('/attendance/', { params });
    return response.data;
  },

  /**
   * Get current user's own attendance records
   * @param {Object} params - Query parameters (skip, limit)
   * @returns {Promise} - List of user's attendance records
   */
  getMyAttendance: async (params = {}) => {
    const response = await api.get('/attendance/my-attendance', { params });
    return response.data;
  },

  /**
   * Get attendance report with filtering options (admin only)
   * @param {Object} filters - Filter parameters
   * @param {Object} params - Query parameters (skip, limit)
   * @returns {Promise} - Filtered attendance records
   */
  getAttendanceReport: async (filters = {}, params = {}) => {
    const response = await api.get('/attendance/report', {
      params: { ...filters, ...params },
    });
    return response.data;
  },

  /**
   * Get all attendance records for a specific date (admin only)
   * @param {string} targetDate - Date in YYYY-MM-DD format (defaults to today)
   * @returns {Promise} - Attendance records for the date
   */
  getDailyAttendance: async (targetDate = null) => {
    const response = await api.get('/attendance/daily', {
      params: { target_date: targetDate },
    });
    return response.data;
  },

  /**
   * Get attendance summary statistics
   * @param {Object} params - Query parameters (user_id, start_date, end_date)
   * @returns {Promise} - Attendance summary statistics
   */
  getAttendanceSummary: async (params = {}) => {
    const response = await api.get('/attendance/summary', { params });
    return response.data;
  },
};

export default AttendanceService;