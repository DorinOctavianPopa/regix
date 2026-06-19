/**
 * Record of Definitive Case Registry.
 */
export interface RegistryDefinitiveCaseRecord {
    /** Unique case record identifier. */
    id: number;
    /** Case number associated with the record. */
    caseNumber: string;
    /** Object associated with the record. */    
    id_type_object: number;
    /** Last id of internal circuit */
    lastIdInternalCircuit: number;
    /** Final decision date */
    finalDecisionDate: Date;
    /** Last description of internal circuit */
    lastDescriptionInternalCircuit: string;
    /**  last date of internal circuit */
    lastDateInternalCircuit: Date;   
    /**
     * Name of the object type, included for convenience to avoid additional lookups.
     */
    type_object_name: string;
    updatedAt: string;  
}

/**
 * Query parameters for definitive case records paged endpoint.
 */
export interface RegistryDefinitiveCaseFilter {
    /** One-based page index. */
    page?: number;
    /** Number of records per page. */
    pageSize?: number;
    /** Optional start date filter (ISO yyyy-MM-dd). */
    startDate?: string;
    /** Optional end date filter (ISO yyyy-MM-dd). */
    endDate?: string;
    /** Optional selected object types filter. */
    idTypeObjects?: number[];
    /** Optional sort column name. */
    sortBy?: string;
    /** Optional sort direction. */
    sortOrder?: 'asc' | 'desc';
}

/**
 * Paged response of definitive case records.
 */
export interface RegistryDefinitiveCaseDataResponse {
    records: RegistryDefinitiveCaseRecord[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
}