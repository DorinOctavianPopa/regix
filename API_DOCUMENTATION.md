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

The backend uses Microsoft SQL Server with the following tables:

### Users Table
```sql
CREATE TABLE Users (
    Id NVARCHAR(450) PRIMARY KEY,
    Username NVARCHAR(256) NOT NULL UNIQUE,
    Email NVARCHAR(256) NOT NULL,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    DepartmentId NVARCHAR(450) NOT NULL,
    IsAdmin BIT DEFAULT 0,
    Created DATETIME2 DEFAULT GETDATE(),
    Modified DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id)
)
```

### Departments Table
```sql
CREATE TABLE Departments (
    Id NVARCHAR(450) PRIMARY KEY,
    Name NVARCHAR(256) NOT NULL UNIQUE,
    Description NVARCHAR(MAX),
    Created DATETIME2 DEFAULT GETDATE()
)
```

### Registries Table
```sql
CREATE TABLE Registries (
    Id NVARCHAR(450) PRIMARY KEY,
    Name NVARCHAR(256) NOT NULL,
    Description NVARCHAR(MAX),
    TableName NVARCHAR(256) NOT NULL,
    DepartmentId NVARCHAR(450) NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (DepartmentId) REFERENCES Departments(Id)
)
```

### ColumnMappings Table
```sql
CREATE TABLE ColumnMappings (
    Id NVARCHAR(450) PRIMARY KEY,
    RegistryId NVARCHAR(450) NOT NULL,
    SqlColumnName NVARCHAR(256) NOT NULL,
    UiColumnName NVARCHAR(256) NOT NULL,
    DataType NVARCHAR(50) NOT NULL,
    MaxLength INT NULL,
    AcceptedValues NVARCHAR(MAX) NULL,
    IsRequired BIT DEFAULT 0,
    IsEditable BIT DEFAULT 1,
    IsVisible BIT DEFAULT 1,
    DisplayOrder INT DEFAULT 0,
    FOREIGN KEY (RegistryId) REFERENCES Registries(Id)
)
```

### UserRegistryAccess Table
```sql
CREATE TABLE UserRegistryAccess (
    UserId NVARCHAR(450) NOT NULL,
    RegistryId NVARCHAR(450) NOT NULL,
    CanView BIT DEFAULT 1,
    CanEdit BIT DEFAULT 0,
    CanDelete BIT DEFAULT 0,
    CanAdd BIT DEFAULT 0,
    PRIMARY KEY (UserId, RegistryId),
    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (RegistryId) REFERENCES Registries(Id)
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

## Registry API Endpoints

### Get Accessible Registries

**Endpoint:** `GET /api/registries/accessible`

**Description:** Get all registries accessible to the current user based on UserRegistryAccess table.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):**
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "tableName": "string",
    "departmentId": "string",
    "department": {
      "id": "string",
      "name": "string",
      "description": "string"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
]
```

### Get All Registries (Admin)

**Endpoint:** `GET /api/registries`

**Description:** Get all registries in the system (admin only).

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):** Same as accessible registries.

### Get Registry by ID

**Endpoint:** `GET /api/registries/{registryId}`

**Description:** Get details of a specific registry.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):** Single registry object.

### Get Column Mappings

**Endpoint:** `GET /api/registries/{registryId}/columns`

**Description:** Get column mappings for a registry.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):**
```json
[
  {
    "id": "string",
    "registryId": "string",
    "sqlColumnName": "string",
    "uiColumnName": "string",
    "dataType": "string|number|date|boolean|select",
    "maxLength": 100,
    "acceptedValues": ["value1", "value2"],
    "isRequired": true,
    "isEditable": true,
    "isVisible": true,
    "displayOrder": 1
  }
]
```

### Get Registry Data

**Endpoint:** `GET /api/registries/{registryId}/data`

**Description:** Get records from a registry with optional filtering.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
- `departmentId` (optional): Filter by department
- `year` (optional): Filter by year
- `searchTerm` (optional): Search term
- `sortBy` (optional): Column to sort by
- `sortOrder` (optional): 'asc' or 'desc'
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Records per page (default: 50)

**Success Response (200 OK):**
```json
{
  "records": [
    {
      "id": "string",
      "field1": "value1",
      "field2": "value2"
    }
  ],
  "totalCount": 100,
  "page": 1,
  "pageSize": 50,
  "totalPages": 2
}
```

### Create Registry Record

**Endpoint:** `POST /api/registries/{registryId}/data`

**Description:** Create a new record in a registry.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```

**Success Response (201 Created):** Created record object.

### Update Registry Record

**Endpoint:** `PUT /api/registries/{registryId}/data/{recordId}`

**Description:** Update an existing record in a registry.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "field1": "newValue1",
  "field2": "newValue2"
}
```

**Success Response (200 OK):** Updated record object.

### Delete Registry Record

**Endpoint:** `DELETE /api/registries/{registryId}/data/{recordId}`

**Description:** Delete a record from a registry.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (204 No Content)**

### Create Registry (Admin)

**Endpoint:** `POST /api/registries`

**Description:** Create a new registry (admin only).

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "tableName": "string",
  "departmentId": "string"
}
```

**Success Response (201 Created):** Created registry object.

### Update Registry (Admin)

**Endpoint:** `PUT /api/registries/{registryId}`

**Description:** Update a registry (admin only).

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "departmentId": "string"
}
```

**Success Response (200 OK):** Updated registry object.

### Delete Registry (Admin)

**Endpoint:** `DELETE /api/registries/{registryId}`

**Description:** Delete a registry (admin only).

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (204 No Content)**

### Get User Access

**Endpoint:** `GET /api/registries/access/{userId}`

**Description:** Get registry access permissions for a user.

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Success Response (200 OK):**
```json
[
  {
    "userId": "string",
    "registryId": "string",
    "canView": true,
    "canEdit": false,
    "canDelete": false,
    "canAdd": true
  }
]
```

### Update User Access (Admin)

**Endpoint:** `PUT /api/registries/access/{userId}/{registryId}`

**Description:** Update user access to a registry (admin only).

**Request Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "canView": true,
  "canEdit": true,
  "canDelete": false,
  "canAdd": true
}
```

**Success Response (200 OK):** Updated access object.

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
