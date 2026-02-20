/**
 * Authentication related types and interfaces
 */

/**
 * Represents an authenticated application user.
 */
export interface User {
  /** Unique user identifier. */
  id: string;
  /** Username used for login and display in system records. */
  username: string;
  /** Primary email address of the user. */
  email: string;
  /** Full name shown in the application UI. */
  displayName: string;
  /** Role names assigned to the user for authorization checks. */
  roles: string[];
  /** Directory or application groups associated with the user. */
  groups: string[];
  /** Optional department associated with the user profile. */
  department?: string;
  /** Indicates whether the user has administrator privileges. */
  isAdmin?: boolean;
}


/**
 * Credentials required to perform an authentication request.
 */
export interface LoginCredentials {
  /** Username provided by the user during sign in. */
  username: string;
  /** Password provided by the user during sign in. */
  password: string;
  /** Optional API instance identifier selected at login time. */
  instanceId?: string;
  /** Numeric institution identifier required by the backend API. */
  id_institutie: number;
}

/**
 * Result returned by the authentication endpoint.
 */
export interface AuthResponse {
  /** Bearer token used for authenticated API requests. */
  token: string;
  /** Authenticated user details resolved by the backend. */
  user: User;
  /** Optional informational message returned by the API. */
  message?: string;
  /** Error text returned by the API when authentication fails. */
  error: string;
  /** Token lifetime in seconds. */
  expiresIn: number;
}

/**
 * Client-side authentication state maintained by the app.
 */
export interface AuthState {
  /** Indicates whether a valid authenticated session exists. */
  isAuthenticated: boolean;
  /** Current authenticated user, or null when signed out. */
  user: User | null;
  /** Current bearer token, or null when not authenticated. */
  token: string | null;
  /** Indicates whether an authentication-related request is in progress. */
  loading: boolean;
  /** Current authentication error message, if any. */
  error: string | null;
}
