/**
 * Registry service for handling API calls to manage registries
 * All API interactions use Bearer Token authorization
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Registry,
  RegistryRecord,
  ColumnMapping,
  UserRegistryAccess,
  RegistryFilter,
  RegistryDataResponse,
} from '../types/registry.types';
import { logger } from '../utils/logger';
import { getApiBaseUrl } from '../utils/apiConfig';

class RegistryService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: getApiBaseUrl(),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include bearer token
    this.api.interceptors.request.use(
      (config) => {
        config.baseURL = getApiBaseUrl();
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          logger.debug('Adding Bearer token to registry request', { url: config.url });
        }
        return config;
      },
      (error) => {
        logger.error('Registry request interceptor error', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        logger.debug('Registry API response received', { 
          url: response.config.url, 
          status: response.status 
        });
        return response;
      },
      (error: AxiosError) => {
        logger.error('Registry API error', {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
        });
        return Promise.reject(error);
      }
    );
  }

  /**
   * Get all registries accessible to the current user
   */
  async getAccessibleRegistries(userId: string | number): Promise<Registry[]> {
    try {
      if (userId === undefined || userId === null || userId === '') {
        throw new Error('User ID is required to fetch accessible registries');
      }
      logger.info('Fetching accessible registries', { userId });
      const response = await this.api.get<Registry[]>(
        `/Registry/Registries/Accessible/${userId}`
      );
      logger.info('Accessible registries fetched', { count: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch accessible registries', error);
      throw error;
    }
  }

  /**
   * Get all registries (admin only)
   */
  async getAllRegistries(): Promise<Registry[]> {
    try {
      logger.info('Fetching all registries');
      const response = await this.api.get<Registry[]>('/Registry/Registries');
      logger.info('All registries fetched', { count: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch all registries', error);
      throw error;
    }
  }

  /**
   * Get a specific registry by ID
   */
  async getRegistry(registryId: string): Promise<Registry> {
    try {
      logger.info('Fetching registry', { registryId });
      const response = await this.api.get<Registry>(`/Registry/Registries/${registryId}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch registry', { registryId, error });
      throw error;
    }
  }

  /**
   * Get column mappings for a registry
   */
  async getColumnMappings(registryId: string): Promise<ColumnMapping[]> {
    try {
      logger.info('Fetching column mappings', { registryId });
      const response = await this.api.get<ColumnMapping[]>(
        `/Registry/Registries/${registryId}/ColumnMappings`
      );
      logger.debug('Column mappings fetched', { 
        registryId, 
        count: response.data 
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch column mappings', { registryId, error });
      throw error;
    }
  }

  /**
   * Get records from a registry with filtering
   */
  async getRegistryData(
    registryId: string,
    filter: RegistryFilter = {}
  ): Promise<RegistryDataResponse> {
    try {
      logger.info('Fetching registry data', { registryId, filter });
      const response = await this.api.post<RegistryDataResponse>(
        `/Registry/Registries/${registryId}/PagedRecords`,
         filter 
      );
      logger.info('Registry data fetched', { 
        registryId, 
        recordCount: response.data.records.length,
        totalCount: response.data.totalCount ,
        recordsFetched: response.data.records
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch registry data', { registryId, error });
      throw error;
    }
  }

  /**
   * Create a new record in a registry
   */
  async createRecord(registryId: string, data: Partial<RegistryRecord>): Promise<RegistryRecord> {
    try {
      logger.info('Creating registry record', { registryId });
      const response = await this.api.post<RegistryRecord>(
        `/registries/${registryId}/data`,
        data
      );
      logger.info('Registry record created', { registryId, recordId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to create registry record', { registryId, error });
      throw error;
    }
  }

  /**
   * Update a record in a registry
   */
  async updateRecord(
    registryId: string,
    recordId: string,
    data: Partial<RegistryRecord>
  ): Promise<RegistryRecord> {
    try {
      logger.info('Updating registry record', { registryId, recordId });
      const response = await this.api.put<RegistryRecord>(
        `/registries/${registryId}/data/${recordId}`,
        data
      );
      logger.info('Registry record updated', { registryId, recordId });
      return response.data;
    } catch (error) {
      logger.error('Failed to update registry record', { registryId, recordId, error });
      throw error;
    }
  }

  /**
   * Delete a record from a registry
   */
  async deleteRecord(registryId: number, recordId: number): Promise<void> {
    try {
      logger.info('Deleting registry record', { registryId, recordId });
      await this.api.delete(`/registries/${registryId}/data/${recordId}`);
      logger.info('Registry record deleted', { registryId, recordId });
    } catch (error) {
      logger.error('Failed to delete registry record', { registryId, recordId, error });
      throw error;
    }
  }

  /**
   * Create a new registry (admin only)
   */
  async createRegistry(data: Partial<Registry>): Promise<Registry> {
    try {
      logger.info('Creating registry', { name: data.name });
      const response = await this.api.post<Registry>('/registries', data);
      logger.info('Registry created', { registryId: response.data.id });
      return response.data;
    } catch (error) {
      logger.error('Failed to create registry', error);
      throw error;
    }
  }

  /**
   * Update a registry (admin only)
   */
  async updateRegistry(registryId: string, data: Partial<Registry>): Promise<Registry> {
    try {
      logger.info('Updating registry', { registryId });
      const response = await this.api.put<Registry>(`/registries/${registryId}`, data);
      logger.info('Registry updated', { registryId });
      return response.data;
    } catch (error) {
      logger.error('Failed to update registry', { registryId, error });
      throw error;
    }
  }

  /**
   * Delete a registry (admin only)
   */
  async deleteRegistry(registryId: string): Promise<void> {
    try {
      logger.info('Deleting registry', { registryId });
      await this.api.delete(`/registries/${registryId}`);
      logger.info('Registry deleted', { registryId });
    } catch (error) {
      logger.error('Failed to delete registry', { registryId, error });
      throw error;
    }
  }

  /**
   * Get user access permissions for registries
   */
  async getUserAccess(userId: string): Promise<UserRegistryAccess[]> {
    try {
      logger.info('Fetching user registry access', { userId });
      const response = await this.api.get<UserRegistryAccess[]>(
        `/registries/access/${userId}`
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch user registry access', { userId, error });
      throw error;
    }
  }

  /**
   * Update user access to a registry (admin only)
   */
  async updateUserAccess(
    userId: string,
    registryId: string,
    access: Partial<UserRegistryAccess>
  ): Promise<UserRegistryAccess> {
    try {
      logger.info('Updating user registry access', { userId, registryId });
      const response = await this.api.put<UserRegistryAccess>(
        `/registries/access/${userId}/${registryId}`,
        access
      );
      logger.info('User registry access updated', { userId, registryId });
      return response.data;
    } catch (error) {
      logger.error('Failed to update user registry access', { userId, registryId, error });
      throw error;
    }
  }
}

export const registryService = new RegistryService();
