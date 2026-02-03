/**
 * Login Page Component
 * Modern authentication interface with form validation
 */

import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!username.trim()) {
      setLocalError('Username is required');
      logger.warn('Login attempt with empty username');
      return;
    }

    if (!password.trim()) {
      setLocalError('Password is required');
      logger.warn('Login attempt with empty password');
      return;
    }

    try {
      logger.info('Submitting login form', { username });
      await login({ username, password });
      logger.info('Login successful, navigating to dashboard');
      navigate('/dashboard');
    } catch (err) {
      logger.error('Login submission failed', err);
      // Error is already set by the auth context
    }
  };

  const displayError = localError || error;

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Records Archive</h1>
          <p>Authentication Required</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {displayError && (
            <div className="error-message" role="alert">
              {displayError}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Secure authentication via Microsoft SQL Server</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
