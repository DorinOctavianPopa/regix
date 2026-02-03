/**
 * Authentication related types and interfaces
 */

export interface User {
  id: string;
  username: string;
  email: string;
  roles: string[];
  departmentId: string;
  departmentName?: string;
  isAdmin?: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
