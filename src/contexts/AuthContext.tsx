/**
 * Authentication context for managing authentication state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, LoginCredentials, User } from '../types/auth.types';
import { authService } from '../services/auth.service';
import { logger } from '../utils/logger';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      logger.debug('Checking authentication status on mount');
      const token = authService.getToken();
      const user = authService.getUser();

      if (token && user) {
        try {
          // Verify token is still valid
          await authService.verifyToken();
          setAuthState({
            isAuthenticated: true,
            user,
            token,
            loading: false,
            error: null,
          });
          logger.info('User authenticated from stored credentials', { userId: user.id });
        } catch (error) {
          logger.warn('Stored token is invalid, clearing authentication');
          setAuthState({
            isAuthenticated: false,
            user: null,
            token: null,
            loading: false,
            error: null,
          });
        }
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      logger.info('Starting login process', { username: credentials.username });
      
      const response = await authService.login(credentials);
      
      setAuthState({
        isAuthenticated: true,
        user: response.user,
        token: response.token,
        loading: false,
        error: null,
      });
      
      logger.info('Login successful, user authenticated', { userId: response.user.id });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      logger.error('Login failed', { error: errorMessage });
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: errorMessage,
      });
      
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      logger.info('Starting logout process');
      await authService.logout();
      
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
      
      logger.info('Logout successful');
    } catch (error) {
      logger.error('Logout failed', error);
      // Even if API call fails, clear local state
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
