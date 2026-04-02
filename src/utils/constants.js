// Application constants

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ATTENDANCE: '/attendance',
  PROFILE: '/profile',
  SETTINGS: '/settings',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  ATTENDANCE: {
    LIST: '/attendance',
    CREATE: '/attendance/check-in',
    CHECK_OUT: '/attendance/check-out',
    HISTORY: '/attendance/history',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
};

export const DATE_FORMATS = {
  DISPLAY: 'MMMM dd, yyyy',
  DATETIME: 'MMMM dd, yyyy HH:mm',
  API: 'yyyy-MM-dd',
};