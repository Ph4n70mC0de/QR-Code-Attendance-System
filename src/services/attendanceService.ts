import { api } from './api';
import { Class, Session, AttendanceRecord, PaginatedResponse, DashboardStats } from '../types';

export const attendanceService = {
  // Class management
  async getAllClasses(page = 1, limit = 10) {
    return api.get<PaginatedResponse<Class>>(`/classes?page=${page}&limit=${limit}`);
  },

  async getClassById(id: string) {
    return api.get<Class>(`/classes/${id}`);
  },

  async createClass(data: Partial<Class>) {
    return api.post<Class>('/classes', data);
  },

  async updateClass(id: string, data: Partial<Class>) {
    return api.put<Class>(`/classes/${id}`, data);
  },

  async deleteClass(id: string) {
    return api.delete<void>(`/classes/${id}`);
  },

  // Session management
  async getSessionsByClass(classId: string) {
    return api.get<Session[]>(`/classes/${classId}/sessions`);
  },

  async createSession(classId: string) {
    return api.post<Session>(`/classes/${classId}/sessions`, {});
  },

  async startSession(sessionId: string) {
    return api.post<Session>(`/sessions/${sessionId}/start`, {});
  },

  async endSession(sessionId: string) {
    return api.post<Session>(`/sessions/${sessionId}/end`, {});
  },

  async getSession(sessionId: string) {
    return api.get<Session>(`/sessions/${sessionId}`);
  },

  // Attendance records
  async getAttendanceBySession(sessionId: string) {
    return api.get<AttendanceRecord[]>(`/sessions/${sessionId}/attendance`);
  },

  async getAttendanceByStudent(studentId: string, page = 1, limit = 10) {
    return api.get<PaginatedResponse<AttendanceRecord>>(
      `/students/${studentId}/attendance?page=${page}&limit=${limit}`
    );
  },

  async markAttendance(sessionId: string, studentId: string, status: 'present' | 'absent' | 'late') {
    return api.post<AttendanceRecord>(`/sessions/${sessionId}/attendance`, { studentId, status });
  },

  async scanQRCode(sessionId: string, qrData: string) {
    return api.post<{ success: boolean; student: AttendanceRecord }>(
      `/sessions/${sessionId}/scan`,
      { qrData }
    );
  },

  // Dashboard stats
  async getDashboardStats() {
    return api.get<DashboardStats>('/dashboard/stats');
  },

  async getInstructorDashboardStats(instructorId: string) {
    return api.get<DashboardStats>(`/instructors/${instructorId}/dashboard`);
  },

  // Export reports
  async exportAttendanceReport(classId?: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (classId) params.append('classId', classId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return api.get<Blob>(`/reports/attendance/export?${params.toString()}`, {
      responseType: 'blob',
    });
  },
};

export default attendanceService;