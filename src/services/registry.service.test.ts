/**
 * Registry Service Tests
 */

import axios from 'axios';
import { registryService } from './registry.service';
import { Registry, RegistryRecord, ColumnMapping } from '../types/registry.types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RegistryService', () => {
  const mockRegistry: Registry = {
    id: 1,
    name: 'Test Registry',
    description: 'Test Description',
    tableName: 'test_table',
    departmentId: 1,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
  };

  const mockColumns: ColumnMapping[] = [
    {
      id: 1,
      registryId: 1,
      sqlColumnName: 'name',
      uiColumnName: 'Name',
      dataType: 'string',
      isRequired: true,
      isEditable: true,
      isVisible: true,
      displayOrder: 1,
    },
  ];

  const mockRecords: RegistryRecord[] = [
    { id: 1, name: 'Record 1' },
    { id: 2 , name: 'Record 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    
    // Mock axios.create to return a mock instance
    mockedAxios.create = jest.fn(() => ({
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })) as any;
  });

  it('should be defined', () => {
    expect(registryService).toBeDefined();
  });

  describe('getAccessibleRegistries', () => {
    it('should fetch accessible registries', async () => {
      const mockResponse = { data: [mockRegistry] };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      
      // Create a new instance for this test
      const service = new (registryService.constructor as any)();
      service.api = { get: mockGet } as any;

      const result = await service.getAccessibleRegistries(10);
      
      expect(mockGet).toHaveBeenCalledWith('/registries/accessible/10');
      expect(result).toEqual([mockRegistry]);
    });
  });

  describe('getRegistry', () => {
    it('should fetch a specific registry', async () => {
      const mockResponse = { data: mockRegistry };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      
      const service = new (registryService.constructor as any)();
      service.api = { get: mockGet } as any;

      const result = await service.getRegistry('1');
      
      expect(mockGet).toHaveBeenCalledWith('/registries/1');
      expect(result).toEqual(mockRegistry);
    });
  });

  describe('getColumnMappings', () => {
    it('should fetch column mappings for a registry', async () => {
      const mockResponse = { data: mockColumns };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      
      const service = new (registryService.constructor as any)();
      service.api = { get: mockGet } as any;

      const result = await service.getColumnMappings('1');
      
      expect(mockGet).toHaveBeenCalledWith('/registries/1/columns');
      expect(result).toEqual(mockColumns);
    });
  });

  describe('createRecord', () => {
    it('should create a new record', async () => {
      const newRecord = { name: 'New Record' };
      const mockResponse = { data: { id: '3', ...newRecord } };
      const mockPost = jest.fn().mockResolvedValue(mockResponse);
      
      const service = new (registryService.constructor as any)();
      service.api = { post: mockPost } as any;

      const result = await service.createRecord('1', newRecord);
      
      expect(mockPost).toHaveBeenCalledWith('/registries/1/data', newRecord);
      expect(result).toEqual({ id: '3', ...newRecord });
    });
  });

  describe('updateRecord', () => {
    it('should update an existing record', async () => {
      const updateData = { name: 'Updated Record' };
      const mockResponse = { data: { id: '1', ...updateData } };
      const mockPut = jest.fn().mockResolvedValue(mockResponse);
      
      const service = new (registryService.constructor as any)();
      service.api = { put: mockPut } as any;

      const result = await service.updateRecord('1', '1', updateData);
      
      expect(mockPut).toHaveBeenCalledWith('/registries/1/data/1', updateData);
      expect(result).toEqual({ id: '1', ...updateData });
    });
  });

  describe('deleteRecord', () => {
    it('should delete a record', async () => {
      const mockDelete = jest.fn().mockResolvedValue({});
      
      const service = new (registryService.constructor as any)();
      service.api = { delete: mockDelete } as any;

      await service.deleteRecord('1', '1');
      
      expect(mockDelete).toHaveBeenCalledWith('/registries/1/data/1');
    });
  });
});
