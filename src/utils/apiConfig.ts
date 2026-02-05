/**
 * API configuration utilities for selecting Web API instance endpoints
 */

import { log } from "console";
import { logger } from "./logger";

export interface ApiInstanceOption {
  id: string;
  name: string;
  baseUrl: string;
  index: number;
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
    index: 211,
  },
  {
    id: "tribunalul-cluj",
    name: "Tribunalul Cluj",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_TRIBUNALUL_CLUJ"),
    index: 117,
  }, 
  {
    id: "judecatoria-gherla",
    name: "Judecatoria Gherla",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_GHERLA"),
    index: 235,
  },
  {
    id: "judecatoria-dej",
    name: "Judecatoria Dej",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_DEJ"),
    index: 236, 
  },
  {
    id: "judecatoria-huedin",
    name: "Judecatoria Huedin",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_HUEDIN"),
    index: 237,
  },
  {
    id: "judecatoria-turda",
    name: "Judecatoria Turda",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_JUDECATORIA_TURDA"),
    index: 238,         
  },
  {
    id: "tribunalul-specializat-cluj",
    name: "Tribunalul Specializat Cluj",
    baseUrl: buildInstanceBaseUrl("REACT_APP_API_BASE_URL_TRIBUNALUL_SPECIALIZAT_CLUJ"),
    index: 239, 
  },
];

export const API_BASE_URL_STORAGE_KEY = "api_base_url";
export const API_INSTANCE_ID_STORAGE_KEY = "api_instance_id";
export const API_INDEXD_STORAGE_KEY = "api_index";

export const getApiBaseUrl = (): string => {
  return localStorage.getItem(API_BASE_URL_STORAGE_KEY) || DEFAULT_API_BASE_URL;
};

export const getIndex = (): number => {
  const storedIndex = localStorage.getItem(API_INDEXD_STORAGE_KEY);
  return storedIndex ? Number(storedIndex) : 0;
};

export const getApiInstanceId = (): string | null => {
  return localStorage.getItem(API_INSTANCE_ID_STORAGE_KEY);
};

export const setIndex = (index: number): void => {
  localStorage.setItem(API_INDEXD_STORAGE_KEY, index.toString());
}

export const setApiInstance = (instanceId: string): void => {
  const option = API_INSTANCE_OPTIONS.find((item) => item.id === instanceId);
  if (!option) {
    return;
  }

  localStorage.setItem(API_INSTANCE_ID_STORAGE_KEY, option.id);
  localStorage.setItem(API_BASE_URL_STORAGE_KEY, option.baseUrl);
  localStorage.setItem(API_INDEXD_STORAGE_KEY, option.index.toString());
};
