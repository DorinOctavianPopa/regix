/**
 * Registry Detail Page
 * Displays registry data with filtering, sorting, and CRUD operations
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registryService } from '../services/registry.service';
import {
  Registry,
  RegistryRecord,
  ColumnMapping,
  RegistryFilter,
} from '../types/registry.types';
import { useAuth } from '../contexts/AuthContext';
import { logger } from '../utils/logger';
import DataGrid from '../components/DataGrid';
import './RegistryDetailPage.css';

const RegistryDetailPage: React.FC = () => {
  const { registryId } = useParams<{ registryId: string }>();
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [columns, setColumns] = useState<ColumnMapping[]>([]);
  const [records, setRecords] = useState<RegistryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedDepartment, setSelectedDepartment] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { user } = useAuth();
  const navigate = useNavigate();

  const pageSize = 50;

  useEffect(() => {
    if (registryId) {
      loadRegistryData();
    }
  }, [registryId, currentPage, selectedYear, selectedDepartment, sortBy, sortOrder]);

  const loadRegistryData = async () => {
    if (!registryId) return;

    try {
      setLoading(true);
      setError(null);
      logger.info('Loading registry data', { registryId });

      // Load registry info and columns in parallel
      const [registryData, columnsData] = await Promise.all([
        registryService.getRegistry(registryId),
        registryService.getColumnMappings(registryId),
      ]);

      setRegistry(registryData);
      setColumns(columnsData);

      // Load records with filters
      const filter: RegistryFilter = {
        page: currentPage,
        pageSize,
        year: selectedYear,
        departmentId: selectedDepartment,
        sortBy,
        sortOrder,
      };

      const recordsData = await registryService.getRegistryData(registryId, filter);
      setRecords(recordsData.records);
      setTotalCount(recordsData.totalCount);

      logger.info('Registry data loaded', {
        registryId,
        recordsCount: recordsData.records.length,
        totalCount: recordsData.totalCount,
      });
    } catch (err) {
      const errorMessage = 'Failed to load registry data';
      logger.error(errorMessage, err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string, order: 'asc' | 'desc') => {
    logger.debug('Sort changed', { column, order });
    setSortBy(column);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sorting
  };

  const handleEdit = (record: RegistryRecord) => {
    logger.info('Edit record', { recordId: record.id });
    // TODO: Implement edit modal
    alert(`Edit record: ${record.id}`);
  };

  const handleDelete = async (record: RegistryRecord) => {
    if (!registryId) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (!confirmed) return;

    try {
      logger.info('Deleting record', { recordId: record.id });
      await registryService.deleteRecord(registryId, record.id);
      logger.info('Record deleted successfully', { recordId: record.id });
      // Reload data
      loadRegistryData();
    } catch (err) {
      logger.error('Failed to delete record', err);
      alert('Failed to delete record');
    }
  };

  const handleAddRecord = () => {
    logger.info('Add new record to registry', { registryId });
    // TODO: Implement add modal
    alert('Add new record functionality coming soon');
  };

  const handleBack = () => {
    navigate('/registries');
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const year = e.target.value ? parseInt(e.target.value, 10) : undefined;
    setSelectedYear(year);
    setCurrentPage(1);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  if (loading && !registry) {
    return (
      <div className="registry-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading registry...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="registry-detail-container">
        <div className="error-container">
          <p className="error-message">⚠️ {error}</p>
          <button onClick={loadRegistryData} className="retry-button">
            Retry
          </button>
          <button onClick={handleBack} className="back-button">
            ← Back to Registries
          </button>
        </div>
      </div>
    );
  }

  if (!registry) {
    return null;
  }

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="registry-detail-container">
      <header className="detail-header">
        <div className="header-left">
          <button onClick={handleBack} className="back-button">
            ← Back
          </button>
          <div>
            <h1>{registry.name}</h1>
            <p className="registry-description">{registry.description}</p>
          </div>
        </div>
        <button onClick={handleAddRecord} className="add-button">
          + Add Record
        </button>
      </header>

      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="year-filter">Year:</label>
          <select
            id="year-filter"
            value={selectedYear || ''}
            onChange={handleYearChange}
            className="filter-select"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-info">
          <span>Total Records: {totalCount}</span>
        </div>
      </div>

      <div className="datagrid-section">
        <DataGrid
          columns={columns}
          data={records}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={true}
          canDelete={true}
          loading={loading}
        />
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistryDetailPage;
