/**
 * Dashboard Page Component
 * Main page after successful authentication
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registryService } from '../services/registry.service';
import { Registry } from '../types/registry.types';
import { logger } from '../utils/logger';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [loadingRegistries, setLoadingRegistries] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      logger.warn('Unauthorized access attempt to dashboard');
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const loadRegistries = async () => {
    try {
      setLoadingRegistries(true);
      logger.info('Loading accessible registries for dashboard');
      let data: Registry[] = [];
      if (user?.isAdmin) {
        data = await registryService.getAllRegistries();
      } else {
        if (!user?.id) {
          throw new Error('User ID not available');
        }
        data = await registryService.getAccessibleRegistries(user.id);
      }
      setRegistries(data);
      logger.info('Registries loaded for dashboard', { count: data.length });
    } catch (err) {
      logger.error('Failed to load registries for dashboard', err);
    } finally {
      setLoadingRegistries(false);
    }
  };

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
          <p>You have successfully authenticated and can now access your registries.</p>
          {user.department && (
            <p className="department-info">Department: {user.department}</p>
          )}
        </div>

        <div className="registries-section">
          <div className="section-header">
            <h3>Your Registries</h3>
            <button 
              onClick={() => navigate('/registries')}
              className="view-all-button"
            >
              View All →
            </button>
          </div>
          
          {loadingRegistries ? (
            <div className="loading-registries">
              <div className="spinner"></div>
              <p>Loading registries...</p>
            </div>
          ) : registries.length === 0 ? (
            <div className="no-registries">
              <p>You don't have access to any registries yet.</p>
              {user.isAdmin && (
                <button 
                  onClick={() => navigate('/registries/new')}
                  className="create-registry-button"
                >
                  Create Registry
                </button>
              )}
            </div>
          ) : (
            <div className="dashboard-grid">
              {registries.slice(0, 4).map((registry) => (
                <div
                  key={registry.id}
                  className="dashboard-card"
                  onClick={() => navigate(`/registries/${registry.id}`)}
                >
                  <div className="card-icon">📊</div>
                  <h3>{registry.name}</h3>
                  <p>{registry.description}</p>
                  <div className="card-footer">
                    <span className="card-meta">
                      🏢 {registry.department?.name || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/registries')}>
            <div className="card-icon">📁</div>
            <h3>All Registries</h3>
            <p>View and manage all accessible registries</p>
            <button className="card-button">View Registries</button>
          </div>

          {user.isAdmin && (
            <div className="dashboard-card" onClick={() => navigate('/admin/users')}>
              <div className="card-icon">👥</div>
              <h3>User Management</h3>
              <p>Manage users and permissions</p>
              <button className="card-button">Manage Users</button>
            </div>
          )}

          {user.isAdmin && (
            <div className="dashboard-card" onClick={() => navigate('/admin/registries')}>
              <div className="card-icon">⚙️</div>
              <h3>Registry Management</h3>
              <p>Create and configure registries</p>
              <button className="card-button">Manage Registries</button>
            </div>
          )}
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
              <label>Department:</label>
              <span>{user.department || 'N/A'}</span>
            </div>
            <div className="info-item">
              <label>Roles:</label>
              <span>{user.roles?.join(', ')}</span>
            </div>
            {user.isAdmin && (
              <div className="info-item">
                <label>Admin:</label>
                <span>Yes ✓</span>
              </div>
            )}
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
