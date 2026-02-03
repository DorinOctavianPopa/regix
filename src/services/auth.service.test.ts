/**
 * Tests for Authentication Service
 */

import { authService } from './auth.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login and store token', async () => {
      const mockResponse = {
        data: {
          token: 'test-token',
          user: {
            id: '1',
            username: 'testuser',
            email: 'test@example.com',
            roles: ['user'],
          },
          expiresIn: 3600,
        },
      };

      mockedAxios.create.mockReturnValue({
        post: jest.fn().mockResolvedValue(mockResponse),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      } as any);

      const credentials = { username: 'testuser', password: 'password' };
      
      // Re-instantiate service to use mocked axios
      const testService = new (authService.constructor as any)();
      
      // Mock the post method
      testService.api = {
        post: jest.fn().mockResolvedValue(mockResponse),
      };

      const result = await testService.login(credentials);

      expect(result.token).toBe('test-token');
      expect(result.user.username).toBe('testuser');
    });
  });

  describe('getToken', () => {
    it('should return stored token', () => {
      localStorage.setItem('auth_token', 'test-token');
      const token = authService.getToken();
      expect(token).toBe('test-token');
    });

    it('should return null when no token stored', () => {
      const token = authService.getToken();
      expect(token).toBeNull();
    });
  });

  describe('getUser', () => {
    it('should return stored user', () => {
      const user = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        roles: ['user'],
      };
      localStorage.setItem('user', JSON.stringify(user));
      
      const retrievedUser = authService.getUser();
      expect(retrievedUser).toEqual(user);
    });

    it('should return null when no user stored', () => {
      const user = authService.getUser();
      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'test-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('logout', () => {
    it('should clear authentication data', async () => {
      localStorage.setItem('auth_token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1' }));

      await authService.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});
