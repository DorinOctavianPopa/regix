/**
 * Authentication related types and interfaces
 */

export interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  roles: string[];
  groups: string[];
  department?: string;
  isAdmin?: boolean;
}


export interface LoginCredentials {
  username: string;
  password: string;
  instanceId?: string;
  id_institutie:number;  
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
  error: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
