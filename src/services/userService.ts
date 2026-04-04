import { api } from './api';
import { User, Student, Instructor, PaginatedResponse } from '../types';

export const userService = {
  // Get all users (Admin only)
  async getAllUsers(page = 1, limit = 10, role?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (role) params.append('role', role);
    return api.get<PaginatedResponse<User>>(`/users?${params.toString()}`);
  },

  // Get user by ID
  async getUserById(id: string) {
    return api.get<User>(`/users/${id}`);
  },

  // Get all students (Admin/Instructor)
  async getAllStudents(page = 1, limit = 10) {
    return api.get<PaginatedResponse<Student>>(`/users/students?page=${page}&limit=${limit}`);
  },

  // Get all instructors (Admin only)
  async getAllInstructors(page = 1, limit = 10) {
    return api.get<PaginatedResponse<Instructor>>(`/users/instructors?page=${page}&limit=${limit}`);
  },

  // Create user (Admin only)
  async createUser(data: Partial<User> & { password: string; role: string }) {
    return api.post<User>('/users', data);
  },

  // Update user
  async updateUser(id: string, data: Partial<User>) {
    return api.put<User>(`/users/${id}`, data);
  },

  // Delete user (Admin only)
  async deleteUser(id: string) {
    return api.delete<void>(`/users/${id}`);
  },

  // Get student's personal QR code
  async getStudentQRCode(studentId: string) {
    return api.get<{ qrCode: string }>(`/users/students/${studentId}/qr`);
  },
};

export default userService;