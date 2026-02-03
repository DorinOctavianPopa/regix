/**
 * Dashboard Page Component
 * Main page after successful authentication
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      logger.warn('Unauthorized access attempt to dashboard');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      logger.info('User initiated logout from dashboard');
      await logout();
      navigate('/login');
    } catch (error) {
      logger.error('Logout failed from dashboard', error);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Records Archive Dashboard</h1>
          <div className="user-info">
            <span className="user-name">Welcome, {user.username}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome to Records Archive System</h2>
          <p>You have successfully authenticated and can now access the system.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">📁</div>
            <h3>Records</h3>
            <p>View and manage archived records</p>
            <button className="card-button">View Records</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔍</div>
            <h3>Search</h3>
            <p>Search through archived documents</p>
            <button className="card-button">Search</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Reports</h3>
            <p>Generate and view reports</p>
            <button className="card-button">View Reports</button>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Configure system settings</p>
            <button className="card-button">Settings</button>
          </div>
        </div>

        <div className="user-details">
          <h3>User Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>User ID:</label>
              <span>{user.id}</span>
            </div>
            <div className="info-item">
              <label>Username:</label>
              <span>{user.username}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Roles:</label>
              <span>{user.roles.join(', ')}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2026 Records Archive System. Powered by Microsoft SQL Server.</p>
      </footer>
    </div>
  );
};

export default DashboardPage;
