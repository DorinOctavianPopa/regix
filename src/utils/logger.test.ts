/**
 * Tests for Logger utility
 */

import { logger } from './logger';

describe('Logger', () => {
  let consoleDebugSpy: jest.SpyInstance;
  let consoleInfoSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleDebugSpy.mockRestore();
    consoleInfoSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log info messages', () => {
    logger.info('Test info message');
    expect(consoleInfoSpy).toHaveBeenCalled();
  });

  it('should log warning messages', () => {
    logger.warn('Test warning message');
    expect(consoleWarnSpy).toHaveBeenCalled();
  });

  it('should log error messages', () => {
    logger.error('Test error message');
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should include timestamp in log messages', () => {
    logger.info('Test message');
    const loggedMessage = consoleInfoSpy.mock.calls[0][0];
    expect(loggedMessage).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
  });

  it('should include log level in messages', () => {
    logger.info('Test message');
    const loggedMessage = consoleInfoSpy.mock.calls[0][0];
    expect(loggedMessage).toContain('[INFO]');
  });

  it('should log with additional data', () => {
    const testData = { key: 'value' };
    logger.info('Test message', testData);
    expect(consoleInfoSpy).toHaveBeenCalledWith(
      expect.stringContaining('[INFO]'),
      testData
    );
  });
});
