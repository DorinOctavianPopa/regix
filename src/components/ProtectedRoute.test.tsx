/**
 * Tests for Protected Route Component
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the auth context
const mockUseAuth = jest.fn();
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => mockUseAuth(),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('should render children when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
    });

    renderProtectedRoute();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should show loading state while checking authentication', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: true,
    });

    renderProtectedRoute();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should redirect to login when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      loading: false,
    });

    renderProtectedRoute();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
