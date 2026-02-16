/**
 * Registry related types and interfaces
 */

export interface Department {
  id: number;
  name: string;
  description: string;
}

export interface Registry {
  id: number;
  name: string;
  description: string;
  tableName: string;
  departmentId: number;
  department?: Department;
  createdAt: string;
  updatedAt: string;
}

export interface ColumnMapping {
  id: number;
  registryId: number;
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
  id: number;
  dynamicFields: { [key: string]: any }; // Dynamic fields based on column mappings
}

export interface UserRegistryAccess {
  userId: number;
  registryId: number;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAdd: boolean;
}

export interface RegistryFilter {
  departmentId?: number;
  year?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  PageSize?: number;
}

export interface RegistryDataResponse {
  records: RegistryRecord[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
