/**
 * Tests for Dashboard Page
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { AuthProvider } from '../contexts/AuthContext';

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock user data
const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  roles: ['user', 'admin'],
};

// Mock the auth context
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    isAuthenticated: true,
    user: mockUser,
    token: 'test-token',
    loading: false,
    error: null,
    login: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: any) => <div>{children}</div>,
}));

const renderDashboardPage = () => {
  return render(
    <BrowserRouter>
      <DashboardPage />
    </BrowserRouter>
  );
};

describe('DashboardPage', () => {
  it('should render dashboard header', () => {
    renderDashboardPage();
    
    expect(screen.getByText('Records Archive Dashboard')).toBeInTheDocument();
  });

  it('should display user welcome message', () => {
    renderDashboardPage();
    
    expect(screen.getByText(/Welcome, testuser/i)).toBeInTheDocument();
  });

  it('should render dashboard cards', () => {
    renderDashboardPage();
    
    expect(screen.getByText('Records')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should display user information', () => {
    renderDashboardPage();
    
    expect(screen.getByText('User Information')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument(); // User ID
    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('user, admin')).toBeInTheDocument();
  });

  it('should render logout button', () => {
    renderDashboardPage();
    
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should render all action buttons', () => {
    renderDashboardPage();
    
    expect(screen.getByText('View Records')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('View Reports')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
