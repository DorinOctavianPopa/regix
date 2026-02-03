/**
 * Registry related types and interfaces
 */

export interface Department {
  id: string;
  name: string;
  description: string;
}

export interface Registry {
  id: string;
  name: string;
  description: string;
  tableName: string;
  departmentId: string;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnMapping {
  id: string;
  registryId: string;
  sqlColumnName: string;
  uiColumnName: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'select';
  maxLength?: number;
  acceptedValues?: string[];
  isRequired: boolean;
  isEditable: boolean;
  isVisible: boolean;
  displayOrder: number;
}

export interface RegistryRecord {
  id: string;
  [key: string]: any; // Dynamic fields based on column mappings
}

export interface UserRegistryAccess {
  userId: string;
  registryId: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
}

export interface RegistryFilter {
  departmentId?: string;
  year?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface RegistryDataResponse {
  records: RegistryRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
