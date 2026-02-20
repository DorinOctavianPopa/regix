/**
 * Registry related types and interfaces
 */

/**
 * Department entity used to group registries.
 */
export interface Department {
  /** Unique department identifier. */
  id: number;
  /** Human-readable department name. */
  name: string;
  /** Department description shown in management views. */
  description: string;
}

/**
 * Registry metadata definition.
 */
export interface Registry {
  /** Unique registry identifier. */
  id: number;
  /** Registry display name. */
  name: string;
  /** Registry description. */
  description: string;
  /** SQL table name that stores records for this registry. */
  tableName: string;
  /** Department identifier that owns this registry. */
  departmentId: number;
  /** Optional hydrated department object. */
  department?: Department;
  /** ISO timestamp when the registry was created. */
  createdAt: string;
  /** ISO timestamp when the registry was last updated. */
  updatedAt: string;
}

/**
 * Select/dropdown option available for select-type columns.
 */
export interface SelectColumnItem {
  /** Label displayed to the user. */
  label: string;
  /** Numeric value persisted in data storage. */
  value: number;
}

/**
 * Validation constraints for a mapped column value.
 */
export interface ColumnValidationRules {
  /** Minimum numeric value accepted for number-type columns. */
  min?: number;
  /** Maximum numeric value accepted for number-type columns. */
  max?: number;
  /** Minimum text length accepted for string-type columns. */
  minLength?: number;
  /** Maximum text length accepted for string-type columns. */
  maxLength?: number;
  /** Regex pattern used for text validation. */
  pattern?: string;
  /** Minimum allowed date value in ISO format. */
  minDate?: string;
  /** Maximum allowed date value in ISO format. */
  maxDate?: string;
  /** Optional message displayed when validation fails. */
  message?: string;
}

/**
 * Describes how a backend column maps to the UI.
 */
export interface ColumnMapping {
  /** Unique column mapping identifier. */
  id: number;
  /** Registry identifier this mapping belongs to. */
  registryId: number;
  /** Source SQL column name in the database table. */
  sqlColumnName: string;
  /** Display name used in the user interface. */
  uiColumnName: string;
  /** Optional rendered width for grid/table views. */
  width?: number;
  /** Data type used for rendering and validation. */
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'select';
  /** Maximum allowed input length for string-like values. */
  maxLength?: number;
  /** Allowed values for select-type columns. */
  acceptedValues?: SelectColumnItem[];
  /** Source table name used to populate select-type options. */
  selectTableName?: string;
  /** Text column name from the select source table used as option label. */
  selectLabelColumnName?: string;
  /** Numeric column name from the select source table used as option value. */
  selectValueColumnName?: string;
  /** Optional validation constraints applied to field values. */
  validationRules?: ColumnValidationRules;
  /** Indicates whether this column is mandatory. */
  isRequired: boolean;
  /** Indicates whether this column can be edited. */
  isEditable: boolean;
  /** Indicates whether this column is visible in UI views. */
  isVisible: boolean;
  /** Position used to sort columns in the interface. */
  displayOrder: number;
}

/**
 * Single registry record containing dynamic mapped values.
 */
export interface RegistryRecord {
  /** Unique record identifier. */
  id: number;
  /** Dynamic key-value fields generated from column mappings. */
  dynamicFields: { [key: string]: any }; // Dynamic fields based on column mappings
}

/**
 * Permission matrix for a user against a specific registry.
 */
export interface UserRegistryAccess {
  /** User identifier the permissions apply to. */
  userId: number;
  /** Registry identifier the permissions apply to. */
  registryId: number;
  /** Indicates whether the user can view records. */
  canView: boolean;
  /** Indicates whether the user can update existing records. */
  canEdit: boolean;
  /** Indicates whether the user can delete records. */
  canDelete: boolean;
  /** Indicates whether the user can create new records. */
  canAdd: boolean;
}

/**
 * Query parameters used to filter and paginate registry data.
 */
export interface RegistryFilter {
  /** Optional department identifier filter. */
  departmentId?: number;
  /** Optional year filter. */
  year?: number;
  /** Optional full-text search term. */
  searchTerm?: string;
  /** Optional sort column name. */
  sortBy?: string;
  /** Optional sort direction. */
  sortOrder?: 'asc' | 'desc';
  /** Optional one-based page index. */
  page?: number;
  /** Optional page size for paginated responses. */
  PageSize?: number;
}

/**
 * Paginated data response for registry records.
 */
export interface RegistryDataResponse {
  /** Records returned for the current page. */
  records: RegistryRecord[];
  /** Total number of records matching the filter. */
  totalCount: number;
  /** Current page index. */
  page: number;
  /** Number of items per page. */
  pageSize: number;
  /** Total number of pages available. */
  totalPages: number;
}
