/**
 * DataGrid component for displaying registry data
 * Supports sorting, filtering, and pagination
 */

import React, { useEffect, useRef, useState } from 'react';
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
  const [showFloatingScrollbar, setShowFloatingScrollbar] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const topScrollbarRef = useRef<HTMLDivElement | null>(null);
  const topScrollbarInnerRef = useRef<HTMLDivElement | null>(null);
  const floatingScrollbarRef = useRef<HTMLDivElement | null>(null);
  const floatingScrollbarInnerRef = useRef<HTMLDivElement | null>(null);

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

  //console.info('columns in datagrid:', columns);
  const handleFilterChange = (columnName: string, value: string) => {
    setFilterValues({ ...filterValues, [columnName]: value });
  };

  const isBooleanType = (dataType: string) =>
    dataType === 'boolean' || dataType === 'bit';

  const toBooleanValue = (value: any): boolean => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return ['true', '1', 'yes', 'y', 'on'].includes(normalized);
    }
    return Boolean(value);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    const topScrollbar = topScrollbarRef.current;
    const topInner = topScrollbarInnerRef.current;
    const floating = floatingScrollbarRef.current;
    const inner = floatingScrollbarInnerRef.current;

    if (!container || !topScrollbar || !topInner || !floating || !inner) {
      return;
    }

    const syncWidth = () => {
      const width = `${container.scrollWidth}px`;
      inner.style.width = width;
      topInner.style.width = width;
      const needsScrollbar = container.scrollWidth > container.clientWidth + 1;
      setShowFloatingScrollbar(needsScrollbar);
      if (needsScrollbar) {
        topScrollbar.scrollLeft = container.scrollLeft;
        floating.scrollLeft = container.scrollLeft;
      }
    };

    const handleContainerScroll = () => {
      const scrollLeft = container.scrollLeft;
      if (topScrollbar.scrollLeft !== scrollLeft) {
        topScrollbar.scrollLeft = scrollLeft;
      }
      if (floating.scrollLeft !== scrollLeft) {
        floating.scrollLeft = scrollLeft;
      }
    };

    const handleTopScroll = () => {
      const scrollLeft = topScrollbar.scrollLeft;
      if (container.scrollLeft !== scrollLeft) {
        container.scrollLeft = scrollLeft;
      }
      if (floating.scrollLeft !== scrollLeft) {
        floating.scrollLeft = scrollLeft;
      }
    };

    const handleFloatingScroll = () => {
      const scrollLeft = floating.scrollLeft;
      if (container.scrollLeft !== scrollLeft) {
        container.scrollLeft = scrollLeft;
      }
      if (topScrollbar.scrollLeft !== scrollLeft) {
        topScrollbar.scrollLeft = scrollLeft;
      }
    };

    syncWidth();
    container.addEventListener('scroll', handleContainerScroll);
    topScrollbar.addEventListener('scroll', handleTopScroll);
    floating.addEventListener('scroll', handleFloatingScroll);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncWidth);
      resizeObserver.observe(container);
    }

    return () => {
      container.removeEventListener('scroll', handleContainerScroll);
      topScrollbar.removeEventListener('scroll', handleTopScroll);
      floating.removeEventListener('scroll', handleFloatingScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [visibleColumns, data.length]);

  useEffect(() => {
    columns.forEach((column) => {
      if (Array.isArray(column.acceptedValues)) {
        console.info('acceptedValues', {
          columnId: column.id,
          columnName: column.sqlColumnName,
          acceptedValues: column.acceptedValues,
        });
      }
    });
  }, [columns]);

  const getColumnStyle = (column: ColumnMapping): React.CSSProperties => {
    if (!column.width) {
      return {};
    }

    return {
      width: `${column.width}px`,
      minWidth: `${column.width}px`,
      maxWidth: `${column.width}px`,
    };
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
      case 'datetime':
      case'smalldatetime':
        const dateValue = new Date(value);
        if (Number.isNaN(dateValue.getTime())) {
          return '';
        }
        return `${String(dateValue.getDate()).padStart(2, '0')}.${String(
          dateValue.getMonth() + 1
        ).padStart(2, '0')}.${dateValue.getFullYear()}`;
      case 'boolean':
      case 'bit':
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
      <div className="datagrid-wrapper" ref={scrollContainerRef}>
        <table className="datagrid">
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className="datagrid-header"
                  style={getColumnStyle(column)}
                >
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
                  {Array.isArray(column.acceptedValues) && column.acceptedValues.length > 0 ? (
                    <select
                      className="column-filter"
                      value={filterValues[column.sqlColumnName] || ''}
                      onChange={(e) =>
                        handleFilterChange(column.sqlColumnName, e.target.value)
                      }
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">All</option>
                      {column.acceptedValues.map((option) => (
                        <option key={`${option.label}-${option.value}`} value={String(option.value)}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
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
                  )}
                </th>
              ))}
              {(canEdit || canDelete) && (
                <th className="datagrid-header actions-header">Actions</th>
              )}
            </tr>
            {showFloatingScrollbar && (
              <tr className="datagrid-scrollbar-row">
                <th
                  className="datagrid-scrollbar-cell"
                  colSpan={
                    visibleColumns.length + (canEdit || canDelete ? 1 : 0)
                  }
                >
                  <div
                    className="datagrid-scrollbar datagrid-scrollbar--top"
                    ref={topScrollbarRef}
                  >
                    <div
                      className="datagrid-scrollbar-inner"
                      ref={topScrollbarInnerRef}
                    />
                  </div>
                </th>
              </tr>
            )}
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
                    <td
                      key={`${record.id}-${column.id}`}
                      className={`datagrid-cell${
                        isBooleanType(column.dataType) ? ' datagrid-cell--checkbox' : ''
                      }`}
                      style={getColumnStyle(column)}
                    >
                      {isBooleanType(column.dataType) ? (
                        <input
                          type="checkbox"
                          className="datagrid-checkbox"
                          checked={toBooleanValue(
                            record.dynamicFields[column.sqlColumnName]
                          )}
                          readOnly
                        />
                      ) : Array.isArray(column.acceptedValues) &&
                        column.acceptedValues.length > 0 ? (
                        <select
                          className="datagrid-select"
                          value={
                            String(record.dynamicFields[column.sqlColumnName] ?? '')
                          }
                          disabled
                        >
                          {column.acceptedValues.map((option) => (
                            <option key={`${option.label}-${option.value}`} value={String(option.value)}>
                              {option.label}
                            </option>
                          ))}
                          {record.dynamicFields[column.sqlColumnName] !== undefined &&
                            record.dynamicFields[column.sqlColumnName] !== null &&
                            !column.acceptedValues.some(
                              (option) =>
                                String(option.value) ===
                                String(record.dynamicFields[column.sqlColumnName])
                            ) && (
                              <option
                                value={String(
                                  record.dynamicFields[column.sqlColumnName]
                                )}
                              >
                                {String(record.dynamicFields[column.sqlColumnName])}
                              </option>
                            )}
                        </select>
                      ) : (
                        formatCellValue(
                          record.dynamicFields[column.sqlColumnName],
                          column.dataType
                        )
                      )}
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
      {showFloatingScrollbar && (
        <div className="datagrid-scrollbar" ref={floatingScrollbarRef}>
          <div
            className="datagrid-scrollbar-inner"
            ref={floatingScrollbarInnerRef}
          />
        </div>
      )}
      <div className="datagrid-footer">
        <p>
          Showing {filteredData.length} of {data.length} records
        </p>
      </div>
    </div>
  );
};

export default DataGrid;
