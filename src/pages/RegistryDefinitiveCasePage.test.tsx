import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import RegistryDefinitiveCasePage from './RegistryDefinitiveCasePage';
import { registryService } from '../services/registry.service';
import { RegistryDefinitiveCaseRecord } from '../types/reghotdef.types';

jest.mock(
  'react-router-dom',
  () => ({
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);

jest.mock('../services/registry.service', () => ({
  registryService: {
    getDefinitiveCaseRecords: jest.fn(),
  },
}));

const mockGetDefinitiveCaseRecords =
  registryService.getDefinitiveCaseRecords as jest.Mock;

const record: RegistryDefinitiveCaseRecord = {
  id: 1,
  caseNumber: 'CASE-1',
  id_type_object: 3777,
  lastIdInternalCircuit: 2,
  finalDecisionDate: new Date(),
  lastDescriptionInternalCircuit: 'Final review',
  lastDateInternalCircuit: new Date(),
  typeObjectName: 'Test object',
  updatedAt: new Date().toISOString(),
};

const renderPage = async (records: RegistryDefinitiveCaseRecord[]) => {
  mockGetDefinitiveCaseRecords.mockResolvedValue({
    records,
    totalCount: records.length,
    page: 1,
    pageSize: 500,
    totalPages: 1,
  });

  render(<RegistryDefinitiveCasePage />);

  await screen.findByRole('button', { name: 'Export XLS' });
};

describe('RegistryDefinitiveCasePage Excel export', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;

  beforeEach(() => {
    mockGetDefinitiveCaseRecords.mockReset();
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: jest.fn(() => 'blob:test-export'),
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: jest.fn(),
    });
  });

  afterAll(() => {
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: originalCreateObjectURL,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      configurable: true,
      value: originalRevokeObjectURL,
    });
  });

  it('does not create an empty Excel file', async () => {
    await renderPage([]);

    fireEvent.click(screen.getByRole('button', { name: 'Export XLS' }));

    expect(URL.createObjectURL).not.toHaveBeenCalled();
  });

  it('downloads the filtered records and keeps the URL alive until after the click', async () => {
    await renderPage([record]);
    let downloadLink: HTMLAnchorElement | null = null;
    const clickSpy = jest
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        downloadLink = this;
      });

    fireEvent.click(screen.getByRole('button', { name: 'Export XLS' }));

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    const exportedBlob = (URL.createObjectURL as jest.Mock).mock
      .calls[0][0] as Blob;
    const exportedHtml = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(exportedBlob);
    });
    expect(exportedBlob.type).toBe('application/vnd.ms-excel;charset=utf-8;');
    expect(exportedHtml).toContain('<td>CASE-1</td>');
    expect(exportedHtml).toContain('<td>Final review</td>');
    expect(downloadLink).not.toBeNull();
    expect(downloadLink).toHaveAttribute(
      'download',
      `definitive-case-records-${new Date().toISOString().slice(0, 10)}.xls`
    );
    expect(downloadLink).toHaveAttribute('href', 'blob:test-export');
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();

    await act(async () => {
      await new Promise((resolve) => window.setTimeout(resolve, 1100));
    });
    await waitFor(() => {
      expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test-export');
    });
    clickSpy.mockRestore();
  });
});
