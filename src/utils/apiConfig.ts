/**
 * API configuration utilities for selecting Web API instance endpoints
 */

import { log } from "console";
import { logger } from "./logger";

export interface ApiInstanceOption {
  id: string;
  name: string;
  baseUrl: string;
}

const DEFAULT_API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

const ENV = process.env as Record<string, string | undefined>;

const buildInstanceBaseUrl = (envKey: string): string => {  
  return ENV[envKey] || DEFAULT_API_BASE_URL;
};

export const API_INSTANCE_OPTIONS: ApiInstanceOption[] = [
  {
    id: "judecatoria-cluj-napoca",
    name: "Judecatoria Cluj-Napoca",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_CLUJ_NAPOCA"),
  },
  {
    id: "tribunalul-cluj",
    name: "Tribunalul Cluj",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_TRIBUNALUL_CLUJ"),
  },
  {
    id: "judecatoria-gherla",
    name: "Judecatoria Gherla",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_GHERLA"),
  },
  {
    id: "judecatoria-dej",
    name: "Judecatoria Dej",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_DEJ"),
  },
  {
    id: "judecatoria-huedin",
    name: "Judecatoria Huedin",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_HUEDIN"),
  },
  {
    id: "judecatoria-turda",
    name: "Judecatoria Turda",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_TURDA"),
  },
  {
    id: "tribunalul-specializat-cluj",
    name: "Tribunalul Specializat Cluj",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_TRIBUNALUL_SPECIALIZAT_CLUJ"),
  },
];

export const API_BASE_URL_STORAGE_KEY = "api_base_url";
export const API_INSTANCE_ID_STORAGE_KEY = "api_instance_id";

export const getApiBaseUrl = (): string => {
  return localStorage.getItem(API_BASE_URL_STORAGE_KEY) || DEFAULT_API_BASE_URL;
};

export const getApiInstanceId = (): string | null => {
  return localStorage.getItem(API_INSTANCE_ID_STORAGE_KEY);
};

export const setApiInstance = (instanceId: string): void => {
  const option = API_INSTANCE_OPTIONS.find((item) => item.id === instanceId);
  if (!option) {
    return;
  }

  localStorage.setItem(API_INSTANCE_ID_STORAGE_KEY, option.id);
  localStorage.setItem(API_BASE_URL_STORAGE_KEY, option.baseUrl);
};
