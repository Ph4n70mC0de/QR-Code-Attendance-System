import { api } from './api';
import { User, LoginCredentials, RegisterData } from '../types';

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await api.post<{ user: User; token: string }>('/auth/login', credentials);
    if (response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  async register(data: RegisterData) {
    return api.post<{ user: User; token: string }>('/auth/register', data);
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async getCurrentUser() {
    return api.get<User>('/auth/me');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};

export default authService;