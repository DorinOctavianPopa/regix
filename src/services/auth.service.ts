/**
 * Authentication service for handling API calls to the backend
 * All API interactions use Bearer Token authorization
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { LoginCredentials, AuthResponse, User } from '../types/auth.types';
import { logger } from '../utils/logger';
import { getApiBaseUrl } from '../utils/apiConfig';
import { log } from 'console';

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json",
      },
    });

    // Add request interceptor to include bearer token
    this.api.interceptors.request.use(
      (config) => {
        config.baseURL = getApiBaseUrl();
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          logger.debug('Adding Bearer token to request', { url: config.url });
        }
        return config;
      },
      (error) => {
        logger.error('Request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        logger.debug('API response received', { url: response.config.url, status: response.status });
        return response;
      },
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          logger.warn('Unauthorized request - clearing authentication');
          this.clearAuth();
        }
        logger.error('API error', { 
          url: error.config?.url, 
          status: error.response?.status,
          message: error.message 
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Login with username and password
   * Stores token and user data in localStorage
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      logger.info('Attempting login', { username: credentials.username, instanceid: credentials.instanceId });
      const response = await this.api.post<AuthResponse>('/ActiveDirectory/LoginReact', credentials);
      logger.debug('Login response received', { status: response.status, data: response.data });
      const { token, user } = response.data;
      
      // Store authentication data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      logger.info('Login successful', { userId: user?.id });
      return response.data;
    } catch (error) {
      logger.error('Login failed', error);
      throw error;
    }
  }

  /**
   * Logout and clear authentication data
   */
  async logout(): Promise<void> {
    try {
      logger.info('Logging out');
      await this.api.post('/auth/logout');
    } catch (error) {
      logger.error('Logout API call failed', error);
    } finally {
      this.clearAuth();
    }
  }

  /**
   * Verify current token is valid
   */
  async verifyToken(): Promise<User> {
    try {
      logger.debug('Verifying token');
      const response = await this.api.get<User>('/auth/verify');
      return response.data;
    } catch (error) {
      logger.error('Token verification failed', error);
      throw error;
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        logger.error('Failed to parse user data', error);
        return null;
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const isAuth = !!token;
    logger.debug('Authentication check', { isAuthenticated: isAuth });
    return isAuth;
  }

  /**
   * Clear authentication data
   */
  private clearAuth(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    logger.debug('Authentication data cleared');
  }
}

export const authService = new AuthService();
