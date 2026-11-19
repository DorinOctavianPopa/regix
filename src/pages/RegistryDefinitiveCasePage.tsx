import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registryService } from '../services/registry.service';
import { RegistryDefinitiveCaseRecord } from '../types/reghotdef.types';
import { logger } from '../utils/logger';
import './RegistryDefinitiveCasePage.css';

const BACKEND_PAGE_SIZE = 500;
const DEFAULT_PAGE_SIZE = 20;

const parseDate = (value: string | Date | null | undefined): Date | null => {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
};

const formatDate = (value: string | Date | null | undefined): string => {
  const date = parseDate(value);
  if (!date) {
    return '-';
  }

  return `${String(date.getDate()).padStart(2, '0')}.${String(
    date.getMonth() + 1
  ).padStart(2, '0')}.${date.getFullYear()}`;
};

const toNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return value;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const RegistryDefinitiveCasePage: React.FC = () => {
  const navigate = useNavigate();

  const [records, setRecords] = useState<RegistryDefinitiveCaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedObjectTypes] = useState<number[]>([3777]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = DEFAULT_PAGE_SIZE;

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        setError(null);

        let page = 1;
        let totalCount = 0;
        let hasMore = true;
        const currentDate = new Date().toISOString().slice(0, 10);
        const all: RegistryDefinitiveCaseRecord[] = [];

        while (hasMore) {
          logger.debug('Requesting registry page for definitive records', {
            page,
            backendPageSize: BACKEND_PAGE_SIZE,
            startDate: startDate || null,
            endDate: endDate || null,
            selectedObjectTypes,
          });

          const response = await registryService.getDefinitiveCaseRecords({
            page,
            pageSize: BACKEND_PAGE_SIZE,
            startDate: startDate || currentDate,
            endDate: endDate || currentDate,
            idTypeObjects:
              selectedObjectTypes.length > 0 ? selectedObjectTypes : undefined,
            sortBy: 'finalDecisionDate',
            sortOrder: 'desc',
          });

          totalCount = response.totalCount;
          all.push(...response.records);

          logger.debug('Received definitive records page', {
            page,
            received: response.records.length,
            totalCount,
            accumulated: all.length,
          });

          hasMore = all.length < totalCount && response.records.length > 0;
          page += 1;

          if (page > 200) {
            logger.warn('Definitive case records loading stopped at safety cap', {
              loaded: all.length,
              totalCount,
            });
            break;
          }
        }

        setRecords(
          all.map((record) => ({
            ...record,
            id: toNumber(record.id),
            id_type_object: toNumber(record.id_type_object),
            lastIdInternalCircuit: toNumber(record.lastIdInternalCircuit),
            finalDecisionDate:
              parseDate(record.finalDecisionDate) ?? new Date(Number.NaN),
            lastDateInternalCircuit:
              parseDate(record.lastDateInternalCircuit) ?? new Date(Number.NaN),
          }))
        );
        logger.info('Definitive case records loaded', {
          totalCount,
          loaded: all.length,
        });
      } catch (err) {
        logger.error('Failed to load definitive case records', err);
        setError('Failed to load definitive case records.');
      } finally {
        setLoading(false);
      }
    };

    logger.debug('Triggering definitive records load effect');
    loadRecords();
  }, [startDate, endDate, selectedObjectTypes]);

  const filteredRecords = useMemo(() => {
    const start = startDate ? parseDate(startDate) : null;
    const end = endDate ? parseDate(endDate) : null;

    const endOfDay = end
      ? new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999)
      : null;

    return records.filter((record) => {
      const finalDate = parseDate(record.finalDecisionDate);

      if (start && (!finalDate || finalDate < start)) {
        return false;
      }

      if (endOfDay && (!finalDate || finalDate > endOfDay)) {
        return false;
      }

      return true;
    });
  }, [records, startDate, endDate]);

  useEffect(() => {
    logger.debug('Definitive records filters changed', {
      startDate: startDate || null,
      endDate: endDate || null,
      selectedObjectTypes,
      recordsLoaded: records.length,
      filteredCount: filteredRecords.length,
    });
  }, [
    startDate,
    endDate,
    selectedObjectTypes,
    records.length,
    filteredRecords.length,
  ]);

  useEffect(() => {
    logger.debug('Resetting definitive records page to first page due to filter/pageSize change', {
      startDate: startDate || null,
      endDate: endDate || null,
      selectedObjectTypes,
      pageSize,
    });
    setCurrentPage(1);
  }, [startDate, endDate, selectedObjectTypes, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));

  const pagedRecords = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const startIndex = (safePage - 1) * pageSize;
    return filteredRecords.slice(startIndex, startIndex + pageSize);
  }, [currentPage, filteredRecords, pageSize, totalPages]);

  useEffect(() => {
    logger.debug('Definitive records pagination state', {
      currentPage,
      pageSize,
      totalPages,
      pageRows: pagedRecords.length,
    });
  }, [currentPage, pageSize, totalPages, pagedRecords.length]);

  const exportToXls = () => {
    logger.info('Export definitive records to XLS requested', {
      filteredCount: filteredRecords.length,
    });

    if (filteredRecords.length === 0) {
      logger.warn('Skipping XLS export because there are no filtered records', {
        selectedObjectTypes,
      });
    }

    const rows = filteredRecords
      .map(
        (record) =>
          `<tr><td>${record.id}</td><td>${escapeHtml(record.caseNumber)}</td><td>${
            record.id_type_object
          }</td><td>${record.lastIdInternalCircuit}</td><td>${escapeHtml(
            formatDate(record.finalDecisionDate)
          )}</td><td>${escapeHtml(
            record.lastDescriptionInternalCircuit
          )}</td><td>${escapeHtml(
            formatDate(record.lastDateInternalCircuit)
          )}</td><td>${escapeHtml(record.typeObjectName || '-')}</td><td>${escapeHtml(
            formatDate(record.updatedAt)
          )}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8" /></head><body><table border="1"><thead><tr><th>ID</th><th>Numar dosar</th><th>ID Tip Obiect</th><th>ID Ultim Circuit Intern</th><th>Data Deciziei Finale</th><th>Descriere Ultim Circuit Intern</th><th>Data Ultim Circuit Intern</th><th>Nume Tip Obiect</th><th>Actualizat La</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;

    const blob = new Blob([html], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });

    const fileName = `definitive-case-records-${new Date()
      .toISOString()
      .slice(0, 10)}.xls`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);

    logger.info('Definitive records XLS export completed', {
      fileName,
      exportedRows: filteredRecords.length,
    });
  };

  const printRecords = () => {
    logger.info('Print definitive records requested', {
      filteredCount: filteredRecords.length,
    });

    const printableRows = filteredRecords
      .map(
        (record) =>
          `<tr><td>${record.id}</td><td>${escapeHtml(record.caseNumber)}</td><td>${
            record.id_type_object
          }</td><td>${record.lastIdInternalCircuit}</td><td>${escapeHtml(
            formatDate(record.finalDecisionDate)
          )}</td><td>${escapeHtml(
            record.lastDescriptionInternalCircuit
          )}</td><td>${escapeHtml(
            formatDate(record.lastDateInternalCircuit)
          )}</td></tr>`
      )
      .join('');

    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    if (!printWindow) {
      logger.warn('Print window was blocked while printing definitive records', {
        selectedObjectTypes,
      });
      return;
    }

    printWindow.document.write(`<!DOCTYPE html><html><head><title>Definitive Case Records</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#222;}h1{font-size:20px;margin:0 0 10px;}p{margin:0 0 16px;}table{border-collapse:collapse;width:100%;font-size:12px;}th,td{border:1px solid #aaa;padding:6px;text-align:left;vertical-align:top;}th{background:#f2f2f2;}</style></head><body><h1>Definitive Case Records</h1><p>Registry: ${escapeHtml(
      'N/A'
    )} | Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>ID</th><th>Case Number</th><th>ID Type Object</th><th>Last Internal Circuit ID</th><th>Final Decision Date</th><th>Last Internal Circuit Description</th><th>Last Internal Circuit Date</th></tr></thead><tbody>${printableRows}</tbody></table></body></html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    logger.info('Print command sent for definitive records', {
      printedRows: filteredRecords.length,
    });
  };

  if (loading) {
    return (
      <div className="definitive-case-container">
        <div className="definitive-case-loading">Loading definitive case records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="definitive-case-container">
        <div className="definitive-case-error">
          <p>{error}</p>
          <button onClick={() => navigate(-1)} className="secondary-button">
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="definitive-case-container">
      <header className="definitive-case-header">
        <div>
          <button onClick={() => navigate(-1)} className="secondary-button">
            ← Back
          </button>
          <h1>Definitive Case Records</h1>
          <p>Registry · ergonomic paged grid view</p>
        </div>
        <div className="header-actions">
          <button onClick={printRecords} className="action-button">
            Print
          </button>
          <button onClick={exportToXls} className="action-button">
            Export XLS
          </button>
        </div>
      </header>

      <section className="filters-panel">
        <div className="filter-field">
          <label htmlFor="startDate">Start date</label>
          <input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="endDate">End date</label>
          <input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

      </section>

      <section className="summary-row">
        <span>Total loaded: {records.length}</span>
        <span>Filtered: {filteredRecords.length}</span>
        <span>
          Page {Math.min(currentPage, totalPages)} of {totalPages}
        </span>
      </section>

      <section className="table-shell">
        <div className="table-wrapper">
          <table className="records-table">
            <thead>
              <tr>                
                <th>Numar dosar</th>
                <th>Tip Obiect dosar</th>
                <th>Data Deciziei Finale</th>
                <th>Descriere Ultim Circuit Intern</th>
                <th>Data Ultim Circuit Intern</th>
              </tr>
            </thead>
            <tbody>
              {pagedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="no-results">
                    No records match current filters.
                  </td>
                </tr>
              ) : (
                pagedRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.caseNumber || '-'}</td>
                    <td>{record.typeObjectName}</td>
                    <td>{formatDate(record.finalDecisionDate)}</td>
                    <td>{record.lastDescriptionInternalCircuit || '-'}</td>
                    <td>{formatDate(record.lastDateInternalCircuit)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="pagination-row">
        <button
          className="secondary-button"
          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
          disabled={currentPage <= 1}
        >
          ← Previous
        </button>
        <button
          className="secondary-button"
          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage >= totalPages}
        >
          Next →
        </button>
      </section>
    </div>
  );
};

export default RegistryDefinitiveCasePage;
