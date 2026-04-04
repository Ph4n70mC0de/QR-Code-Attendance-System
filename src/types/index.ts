export type UserRole = 'admin' | 'instructor' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: 'student';
  studentId: string;
  qrCode: string;
  enrollments?: Enrollment[];
}

export interface Instructor extends User {
  role: 'instructor';
  department?: string;
  classes?: Class[];
}

export interface Admin extends User {
  role: 'admin';
}

export interface Class {
  id: string;
  name: string;
  code: string;
  instructorId: string;
  instructor?: Instructor;
  students?: Student[];
  sessions?: Session[];
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  classId: string;
  class?: Class;
  startTime: string;
  endTime?: string;
  isActive: boolean;
  qrCode?: string;
  attendanceRecords?: AttendanceRecord[];
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  student?: Student;
  classId: string;
  class?: Class;
  enrolledAt: string;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  session?: Session;
  studentId: string;
  student?: Student;
  status: 'present' | 'absent' | 'late';
  scannedAt: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalClasses: number;
  totalSessions: number;
  attendanceRate: number;
}