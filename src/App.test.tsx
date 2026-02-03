/**
 * Tests for Main App Component
 */

import React from 'react';
import { render } from '@testing-library/react';
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

  it('should initialize with router', () => {
    const { container } = render(<App />);
    // Check that the app renders with the router
    expect(container).toBeTruthy();
  });
});

