# API Documentation

## Overview

The Records Archive Application interacts with a Web API backend that uses Microsoft SQL Server for data storage. All API calls require Bearer Token authentication except for the login endpoint.

## Base URL

The API base URL is configurable via the environment variable:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

## Authentication

### Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate a user and receive an access token.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string",
    "roles": ["string"]
  },
  "expiresIn": 3600
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid username or password"
}
```

### Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout the current user and invalidate the token.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

### Verify Token

**Endpoint:** `GET /api/auth/verify`

**Description:** Verify if the current token is valid and get user information.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):**
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "roles": ["string"]
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired token"
}
```

## Authorization

All API endpoints except `/api/auth/login` require a valid Bearer Token in the Authorization header:

```
Authorization: Bearer {token}
```

The token is obtained from the login endpoint and should be included in all subsequent requests.

## Error Handling

The API uses standard HTTP status codes:

- **200 OK** - Request successful
- **400 Bad Request** - Invalid request parameters
- **401 Unauthorized** - Authentication required or token invalid
- **403 Forbidden** - User doesn't have permission
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server error

Error Response Format:
```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Token Management

### Token Storage
Tokens are stored in the browser's localStorage:
- Key: `auth_token`
- Value: JWT token string

### Token Expiration
Tokens expire after the time specified in the `expiresIn` field (in seconds). The frontend automatically handles token expiration by:
1. Redirecting to login on 401 responses
2. Clearing stored token and user data
3. Prompting for re-authentication

### Token Refresh
Token refresh is handled by re-authenticating through the login endpoint. Implement automatic token refresh in future versions if needed.

## CORS Configuration

The backend API should be configured to accept requests from the frontend origin:

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

## Database Schema

The backend uses Microsoft SQL Server with the following authentication-related tables:

### Users Table
```sql
CREATE TABLE Users (
    Id NVARCHAR(450) PRIMARY KEY,
    Username NVARCHAR(256) NOT NULL UNIQUE,
    Email NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    Created DATETIME2 DEFAULT GETDATE(),
    Modified DATETIME2 DEFAULT GETDATE()
)
```

### Roles Table
```sql
CREATE TABLE Roles (
    Id NVARCHAR(450) PRIMARY KEY,
    Name NVARCHAR(256) NOT NULL UNIQUE
)
```

### UserRoles Table
```sql
CREATE TABLE UserRoles (
    UserId NVARCHAR(450) FOREIGN KEY REFERENCES Users(Id),
    RoleId NVARCHAR(450) FOREIGN KEY REFERENCES Roles(Id),
    PRIMARY KEY (UserId, RoleId)
)
```

## Security Considerations

1. **Token Security**: Never expose tokens in URLs or logs
2. **HTTPS**: Use HTTPS in production to encrypt token transmission
3. **Token Expiration**: Implement reasonable token expiration times
4. **Password Hashing**: Use strong hashing algorithms (bcrypt, PBKDF2)
5. **SQL Injection**: Use parameterized queries to prevent SQL injection
6. **Rate Limiting**: Implement rate limiting on authentication endpoints
7. **Logging**: Log authentication attempts for security monitoring

## Implementation Checklist for Backend

- [ ] Set up Microsoft SQL Server database
- [ ] Create user and authentication tables
- [ ] Implement JWT token generation and validation
- [ ] Create authentication endpoints (login, logout, verify)
- [ ] Implement password hashing with bcrypt or similar
- [ ] Configure CORS for frontend origin
- [ ] Add request logging and error handling
- [ ] Implement rate limiting on login endpoint
- [ ] Set up SSL/TLS for production
- [ ] Add database connection pooling
- [ ] Implement token refresh mechanism (optional)
- [ ] Add unit and integration tests
