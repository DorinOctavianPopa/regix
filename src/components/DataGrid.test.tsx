/**
 * DataGrid Component Tests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DataGrid from './DataGrid';
import { ColumnMapping, RegistryRecord } from '../types/registry.types';

describe('DataGrid Component', () => {
  const mockColumns: ColumnMapping[] = [
    {
      id: '1',
      registryId: 'reg1',
      sqlColumnName: 'name',
      uiColumnName: 'Name',
      dataType: 'string',
      isRequired: true,
      isEditable: true,
      isVisible: true,
      displayOrder: 1,
    },
    {
      id: '2',
      registryId: 'reg1',
      sqlColumnName: 'age',
      uiColumnName: 'Age',
      dataType: 'number',
      isRequired: false,
      isEditable: true,
      isVisible: true,
      displayOrder: 2,
    },
  ];

  const mockData: RegistryRecord[] = [
    { id: '1', name: 'John Doe', age: 30 },
    { id: '2', name: 'Jane Smith', age: 25 },
  ];

  it('renders without crashing', () => {
    render(<DataGrid columns={mockColumns} data={mockData} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
  });

  it('displays data correctly', () => {
    render(<DataGrid columns={mockColumns} data={mockData} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<DataGrid columns={mockColumns} data={[]} loading={true} />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('shows no data message when data is empty', () => {
    render(<DataGrid columns={mockColumns} data={[]} />);
    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  it('renders edit and delete buttons when permissions are granted', () => {
    render(
      <DataGrid
        columns={mockColumns}
        data={mockData}
        canEdit={true}
        canDelete={true}
      />
    );
    
    const editButtons = screen.getAllByTitle('Edit');
    const deleteButtons = screen.getAllByTitle('Delete');
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn();
    render(
      <DataGrid
        columns={mockColumns}
        data={mockData}
        canEdit={true}
        onEdit={mockOnEdit}
      />
    );
    
    const editButtons = screen.getAllByTitle('Edit');
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockData[0]);
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = jest.fn();
    render(
      <DataGrid
        columns={mockColumns}
        data={mockData}
        canDelete={true}
        onDelete={mockOnDelete}
      />
    );
    
    const deleteButtons = screen.getAllByTitle('Delete');
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockData[0]);
  });

  it('filters data based on input', () => {
    render(<DataGrid columns={mockColumns} data={mockData} />);
    
    const filterInputs = screen.getAllByPlaceholderText(/Filter/);
    fireEvent.change(filterInputs[0], { target: { value: 'John' } });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('shows record count', () => {
    render(<DataGrid columns={mockColumns} data={mockData} />);
    expect(screen.getByText(/Showing 2 of 2 records/)).toBeInTheDocument();
  });
});
