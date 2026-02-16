/**
 * DataGrid component for displaying registry data
 * Supports sorting, filtering, and pagination
 */

import React, { useState } from 'react';
import { ColumnMapping, RegistryRecord } from '../types/registry.types';
import './DataGrid.css';

interface DataGridProps {
  columns: ColumnMapping[];
  data: RegistryRecord[];
  onSort?: (column: string, order: 'asc' | 'desc') => void;
  onEdit?: (record: RegistryRecord) => void;
  onDelete?: (record: RegistryRecord) => void;
  canEdit?: boolean;
  canDelete?: boolean;
  loading?: boolean;
}

const DataGrid: React.FC<DataGridProps> = ({
  columns,
  data,
  onSort,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
  loading = false,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Sort columns by display order
  const visibleColumns = columns
    .filter((col) => col.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const handleSort = (columnName: string) => {
    const newOrder = sortColumn === columnName && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnName);
    setSortOrder(newOrder);
    if (onSort) {
      onSort(columnName, newOrder);
    }
  };

  const handleFilterChange = (columnName: string, value: string) => {
    setFilterValues({ ...filterValues, [columnName]: value });
  };

  // Filter data based on filter values
  const filteredData = data.filter((record) => {
    return Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      const recordValue = String( record.dynamicFields[key] || '').toLowerCase();
      return recordValue.includes(value.toLowerCase());
    });
  });

  // Format cell value based on data type
  const formatCellValue = (value: any, dataType: string): string => {
    if (value === null || value === undefined) return '';
    
    switch (dataType) {
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : String(value);
      default:
        return String(value);
    }
  };

  if (loading) {
    return (
      <div className="datagrid-loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="datagrid-container">
      <div className="datagrid-wrapper">
        <table className="datagrid">
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column.id} className="datagrid-header">
                  <div className="header-content">
                    <span
                      className="header-title"
                      onClick={() => handleSort(column.sqlColumnName)}
                    >
                      {column.uiColumnName}
                      {sortColumn === column.sqlColumnName && (
                        <span className="sort-indicator">
                          {sortOrder === 'asc' ? ' ↑' : ' ↓'}
                        </span>
                      )}
                    </span>
                  </div>
                  <input
                    type="text"
                    className="column-filter"
                    placeholder={`Filter ${column.uiColumnName}...`}
                    value={filterValues[column.sqlColumnName] || ''}
                    onChange={(e) =>
                      handleFilterChange(column.sqlColumnName, e.target.value)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </th>
              ))}
              {(canEdit || canDelete) && (
                <th className="datagrid-header actions-header">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (canEdit || canDelete ? 1 : 0)}
                  className="no-data"
                >
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((record) => (
                <tr key={record.id} className="datagrid-row">
                  {visibleColumns.map((column) => (
                    <td key={`${record.id}-${column.id}`} className="datagrid-cell">
                      {formatCellValue(record.dynamicFields[column.sqlColumnName], column.dataType)}
                    </td>
                  ))}
                  {(canEdit || canDelete) && (
                    <td className="datagrid-cell actions-cell">
                      {canEdit && (
                        <button
                          className="action-button edit-button"
                          onClick={() => onEdit && onEdit(record)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="action-button delete-button"
                          onClick={() => onDelete && onDelete(record)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="datagrid-footer">
        <p>
          Showing {filteredData.length} of {data.length} records
        </p>
      </div>
    </div>
  );
};

export default DataGrid;
