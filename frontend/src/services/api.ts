import axios from 'axios';
import type { 
  User, 
  UserLogin, 
  UserRegister, 
  AuthResponse, 
  QRCode, 
  QRCodeGenerate,
  QRCodeValidate,
  Session,
  SessionCreate,
  Attendance,
  AttendanceRecord,
  ApiResponse,
  PaginatedResponse 
} from '../types';

// API Base URL - configure based on environment
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear storage and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: UserRegister) => 
    api.post<ApiResponse<User>>('/auth/register', data),
  
  login: (data: UserLogin) => {
    // OAuth2 requires form-encoded data
    const formData = new URLSearchParams();
    formData.append('username', data.username);
    formData.append('password', data.password);
    
    return api.post<AuthResponse>('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  
  getCurrentUser: () => 
    api.get<User>('/auth/me'),
};

// User API
export const userApi = {
  getAll: (page = 1, limit = 10) => 
    api.get<PaginatedResponse<User>>(`/users?page=${page}&limit=${limit}`),
  
  getById: (id: number) => 
    api.get<User>(`/users/${id}`),
  
  update: (id: number, data: Partial<User>) => 
    api.put<User>(`/users/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/users/${id}`),
};

// QR Code API
export const qrApi = {
  generate: (data: QRCodeGenerate) => 
    api.post<ApiResponse<QRCode>>('/qr/generate', data),
  
  validate: (data: QRCodeValidate) => 
    api.post<ApiResponse<{ valid: boolean; message: string }>>('/qr/validate', data),
  
  getById: (id: number) => 
    api.get<QRCode>(`/qr/${id}`),
  
  getBySession: (sessionId: number) => 
    api.get<QRCode[]>(`/qr/session/${sessionId}`),
};

// Session API
export const sessionApi = {
  create: (data: SessionCreate) => 
    api.post<Session>('/sessions', data),
  
  getAll: (page = 1, limit = 10) => 
    api.get<PaginatedResponse<Session>>(`/sessions?page=${page}&limit=${limit}`),
  
  getById: (id: number) => 
    api.get<Session>(`/sessions/${id}`),
  
  update: (id: number, data: Partial<SessionCreate>) => 
    api.put<Session>(`/sessions/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/sessions/${id}`),
  
  getActive: () => 
    api.get<Session[]>('/sessions/active'),
};

// Attendance API
export const attendanceApi = {
  record: (data: AttendanceRecord) => 
    api.post<ApiResponse<Attendance>>('/attendance/record', data),
  
  getBySession: (sessionId: number) => 
    api.get<Attendance[]>(`/attendance/session/${sessionId}`),
  
  getByUser: (userId: number) => 
    api.get<Attendance[]>(`/attendance/user/${userId}`),
  
  update: (id: number, data: Partial<Attendance>) => 
    api.put<Attendance>(`/attendance/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/attendance/${id}`),
  
  getStats: (sessionId: number) => 
    api.get<{ total: number; present: number; absent: number; late: number }>(`/attendance/stats/${sessionId}`),
};

export default api;