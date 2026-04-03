import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user: User | null) => set({ user }),
      
      setToken: (token: string | null) => {
        set({ token });
        if (token) {
          localStorage.setItem('access_token', token);
        } else {
          localStorage.removeItem('access_token');
        }
      },
      
      login: (user: User, token: string) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ 
          user, 
          token, 
          isAuthenticated: true,
          isLoading: false 
        });
      },
      
      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false 
        });
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      clearError: () => set({}),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Initialize state from localStorage on mount
const savedToken = localStorage.getItem('access_token');
const savedUser = localStorage.getItem('user');

if (savedToken && !useAuthStore.getState().token) {
  useAuthStore.getState().setToken(savedToken);
}

if (savedUser && !useAuthStore.getState().user) {
  try {
    const user = JSON.parse(savedUser) as User;
    useAuthStore.getState().setUser(user);
  } catch (e) {
    console.error('Failed to parse saved user:', e);
  }
}