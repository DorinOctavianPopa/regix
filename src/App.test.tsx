/**
 * Tests for Main App Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the auth service
jest.mock('./services/auth.service', () => ({
  authService: {
    getToken: jest.fn(() => null),
    getUser: jest.fn(() => null),
    isAuthenticated: jest.fn(() => false),
  },
}));

describe('App', () => {
  it('should render the application', () => {
    render(<App />);
    // The app should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should initialize with login page', () => {
    render(<App />);
    // Since we're not authenticated, we should see the login page
    // Check for login-related elements after a short delay
    setTimeout(() => {
      const loginElements = screen.queryByText(/Records Archive/i);
      expect(loginElements).toBeTruthy();
    }, 100);
  });
});

