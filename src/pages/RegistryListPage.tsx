/**
 * Registry List Page
 * Displays all registries accessible to the user
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registryService } from '../services/registry.service';
import { Registry } from '../types/registry.types';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';
import './RegistryListPage.css';

const RegistryListPage: React.FC = () => {
  const [registries, setRegistries] = useState<Registry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadRegistries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRegistries = async () => {
    try {
      setLoading(true);
      setError(null);
      logger.info('Loading accessible registries');
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
      logger.info('Registries loaded', { count: data.length });
    } catch (err) {
      const errorMessage = 'Failed to load registries';
      logger.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistryClick = (registryId: number) => {
    navigate(`/registries/${registryId}`);
  };

  const handleCreateRegistry = () => {
    navigate('/registries/new');
  };

  if (loading) {
    return (
      <div className="registry-list-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading registries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="registry-list-container">
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
          <button onClick={loadRegistries} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="registry-list-container">
      <header className="page-header">
        <h1>Registries</h1>
        {user?.isAdmin && (
          <button onClick={handleCreateRegistry} className="create-button">
            + Create New Registry
          </button>
        )}
      </header>

      {registries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h2>No Registries Available</h2>
          <p>You don't have access to any registries yet.</p>
          {user?.isAdmin && (
            <button onClick={handleCreateRegistry} className="create-button">
              Create Your First Registry
            </button>
          )}
        </div>
      ) : (
        <div className="registry-grid">
          {registries.map((registry) => (
            <div
              key={registry.id}
              className="registry-card"
              onClick={() => handleRegistryClick(registry.id)}
            >
              <div className="registry-icon">📊</div>
              <h3 className="registry-name">{registry.name}</h3>
              <p className="registry-description">{registry.description}</p>
              <div className="registry-meta">
                <span className="meta-item">
                  🏢 {registry.department?.name || 'N/A'}
                </span>
                <span className="meta-item">
                  📅 {new Date(registry.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <button className="view-button">View Registry →</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RegistryListPage;
