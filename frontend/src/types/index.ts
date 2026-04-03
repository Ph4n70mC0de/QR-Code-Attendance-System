// User types
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'instructor' | 'student';
  created_at?: string;
  updated_at?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  email: string;
  password: string;
  name: string;
  role?: 'admin' | 'instructor' | 'student';
}

// Auth types
export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// QR Code types
export interface QRCode {
  id: number;
  code: string;
  session_id: number;
  is_valid: boolean;
  expires_at: string;
  created_at: string;
}

export interface QRCodeGenerate {
  session_id: number;
  valid_duration?: number; // in minutes
}

export interface QRCodeValidate {
  code: string;
  user_id: number;
}

// Session types
export interface Session {
  id: number;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  course_id?: number;
  instructor_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionCreate {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  course_id?: number;
}

// Attendance types
export interface Attendance {
  id: number;
  user_id: number;
  session_id: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  check_in_time?: string;
  check_out_time?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: User;
  session?: Session;
}

export interface AttendanceRecord {
  session_id: number;
  status?: 'present' | 'late';
  notes?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  detail?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'student' | 'instructor';
}