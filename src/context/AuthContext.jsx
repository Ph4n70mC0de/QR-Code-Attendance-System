import { createContext, useState, useCallback, useMemo, useEffect } from 'react';
import { STORAGE_KEYS, USER_ROLES } from '../utils';

// Create context
const AuthContext = createContext(null);

/**
 * Get initial user from localStorage
 * @returns {object|null} Stored user or null
 */
const getInitialUser = () => {
  try {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

/**
 * Get initial token from localStorage
 * @returns {string|null} Stored token or null
 */
const getInitialToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * AuthProvider component that wraps the application and provides authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  /**
   * Initialize auth state and validate token on mount
   */
  useEffect(() => {
    const initializeAuth = () => {
      const token = getInitialToken();
      const storedUser = getInitialUser();

      // If we have both token and user, consider them authenticated
      // In production, you would validate the token with the server here
      if (token && storedUser) {
        setUser(storedUser);
      } else {
        // Clear incomplete auth state
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        setUser(null);
      }

      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  /**
   * Perform login action
   * @param {string} email - User email
   * @param {string} _password - User password (unused in mock)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  // eslint-disable-next-line no-unused-vars
  const doLogin = useCallback(async (email, _password) => {
    // TODO: Implement actual API call
    // const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    // const { user: userData, token } = response.data;

    // Mock login for development - determine role based on email for testing
    let role = USER_ROLES.STUDENT; // Default role
    if (email.includes('admin')) {
      role = USER_ROLES.ADMIN;
    } else if (email.includes('teacher')) {
      role = USER_ROLES.TEACHER;
    }

    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0], // Use email prefix as name
      role,
    };
    const token = 'mock-jwt-token';

    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUser));
    setUser(mockUser);

    return { success: true, user: mockUser };
  }, []);

  /**
   * Handle login error
   * @param {Error} err - Error object
   * @returns {{success: boolean, error: string}}
   */
  const doLoginError = useCallback((err) => {
    const errorMessage = err.message || 'Login failed';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  }, []);

  /**
   * Login user with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);

      try {
        const result = await doLogin(email, password);
        return result;
      } catch (err) {
        return doLoginError(err);
      } finally {
        setLoading(false);
      }
    },
    [doLogin, doLoginError]
  );

  /**
   * Register a new user
   * @param {object} userData - User registration data
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const register = useCallback(
    async (userData) => {
      setLoading(true);
      setError(null);

      try {
        // TODO: Implement actual API call
        // const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        // return { success: true, user: response.data.user };

        // Mock registration - store user data for demo purposes
        console.log('Registration data:', userData);
        return { success: true, message: 'Registration successful. Please login.' };
      } catch (err) {
        const errorMessage = err.message || 'Registration failed';
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /**
   * Logout current user
   */
  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setError(null);
  }, []);

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  const isAuthenticated = useCallback(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!user && !!token;
  }, [user]);

  /**
   * Get current authentication token
   * @returns {string|null}
   */
  const getToken = useCallback(() => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }, []);

  /**
   * Check if user has specific role
   * @param {string|string[]} roles - Role(s) to check
   * @returns {boolean}
   */
  const hasRole = useCallback(
    (roles) => {
      if (!user) return false;
      const rolesArray = Array.isArray(roles) ? roles : [roles];
      return rolesArray.includes(user.role);
    },
    [user]
  );

  /**
   * Update user profile
   * @param {object} updates - Profile updates to apply
   */
  const updateUser = useCallback((updates) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const updatedUser = { ...prevUser, ...updates };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      return updatedUser;
    });
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated,
      hasRole,
      getToken,
      updateUser,
      clearError: () => setError(null),
      isInitialized,
    }),
    [
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated,
      hasRole,
      getToken,
      updateUser,
      isInitialized,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
