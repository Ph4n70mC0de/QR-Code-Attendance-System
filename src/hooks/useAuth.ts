import { useAuthStore } from '../store';
import { UserRole } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, isLoading, error, login, logout, register, clearError, setLoading } = useAuthStore();

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };

  const isAdmin = () => hasRole('admin');
  const isInstructor = () => hasRole('instructor');
  const isStudent = () => hasRole('student');

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    clearError,
    setLoading,
    hasRole,
    isAdmin,
    isInstructor,
    isStudent,
  };
};

export default useAuth;