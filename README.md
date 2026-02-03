# Records Archive Application

A modern Records Archive Application built with React and TypeScript, featuring secure authentication and a comprehensive dashboard for managing archived records.

## Features

- **Authentication System**: Secure login with Microsoft Authentication model
- **Bearer Token Authorization**: All API calls use Bearer Token authentication
- **Microsoft SQL Server Backend**: Database management via SQL Server
- **Protected Routes**: Dashboard and other features accessible only after authentication
- **Registry Management**: Complete system for managing multiple registries
  - User-based registry access control
  - Department-based organization
  - Dynamic DataGrid with sorting and filtering
  - CRUD operations on registry records
  - Year-based filtering
  - Column mapping system (SQL to UI)
- **Admin Features**: 
  - User management
  - Registry management
  - Access control management
- **Modern UI**: Clean, responsive, and user-friendly interface
- **Comprehensive Logging**: Built-in logging for debugging and tracing
- **Test Coverage**: Unit tests for all major components and services

## Technology Stack

- **Frontend**: React 19, TypeScript 4.9
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios for API calls
- **Testing**: Jest, React Testing Library
- **Styling**: Custom CSS with modern gradients and animations
- **Backend**: Web API with Microsoft SQL Server (separate project)

## Project Structure

```
src/
├── components/       # Reusable React components
│   ├── ProtectedRoute.tsx    # Route guard for authentication
│   └── DataGrid.tsx          # Dynamic data grid with sorting/filtering
├── contexts/         # React Context providers
│   └── AuthContext.tsx       # Authentication state management
├── pages/           # Page components
│   ├── LoginPage.tsx         # Login/Authentication page
│   ├── DashboardPage.tsx     # Main dashboard after login
│   ├── RegistryListPage.tsx  # List of accessible registries
│   └── RegistryDetailPage.tsx # Registry data view with CRUD
├── services/        # API and external services
│   ├── auth.service.ts       # Authentication API service
│   └── registry.service.ts   # Registry management API service
├── types/           # TypeScript type definitions
│   ├── auth.types.ts         # Authentication-related types
│   └── registry.types.ts     # Registry-related types
├── utils/           # Utility functions
│   └── logger.ts             # Logging utility
└── App.tsx          # Main application component
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend Web API server running (for authentication)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DorinOctavianPopa/regix.git
cd regix
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and set your API base URL:
```
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Running the Application

Start the development server:
```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000)

### Building for Production

Create a production build:
```bash
npm run build
```

The optimized build will be in the `build/` folder.

## Authentication Flow

1. **Login Page**: Users start at the authentication page (`/login`)
2. **Credential Submission**: Username and password are sent to the backend API
3. **Token Reception**: On successful authentication, a Bearer Token is received
4. **Token Storage**: Token and user data are stored in localStorage
5. **Automatic Authentication**: On subsequent visits, stored token is validated
6. **Protected Access**: Dashboard and other routes require valid authentication
7. **Token Expiry**: Invalid/expired tokens redirect users back to login

## Registry System

The application implements a comprehensive registry management system:

### Key Concepts

1. **Departments**: Users belong to departments, and registries are organized by departments
2. **Registries**: Each registry represents a data collection with its own SQL table
3. **Column Mappings**: Define how SQL table columns map to UI DataGrid columns
4. **Access Control**: Users have specific permissions for each registry (view, add, edit, delete)
5. **Dynamic DataGrid**: Displays registry data with sorting, filtering, and pagination

### Registry Features

- **Dashboard View**: Shows accessible registries with quick access
- **Registry List**: Comprehensive view of all accessible registries
- **Registry Detail**: 
  - DataGrid with column-based filtering
  - Sortable columns (click header to sort)
  - Year-based filtering
  - CRUD operations (Add, Edit, Delete records)
  - Pagination for large datasets
- **Admin Functions**:
  - Create and configure registries
  - Manage user access to registries
  - Define column mappings

### Data Flow

1. User logs in and receives authentication token
2. System loads registries accessible to the user
3. User selects a registry to view
4. System loads column mappings and data
5. User can filter, sort, and perform CRUD operations
6. All changes are persisted to the SQL Server database

## API Integration

The application communicates with a backend Web API using Bearer Token authentication.

### API Endpoints

#### Authentication
- **POST** `/api/auth/login` - Authenticate user and receive token
- **POST** `/api/auth/logout` - Logout and invalidate token
- **GET** `/api/auth/verify` - Verify token validity

#### Registries
- **GET** `/api/registries/accessible` - Get registries accessible to current user
- **GET** `/api/registries` - Get all registries (admin only)
- **GET** `/api/registries/{id}` - Get specific registry details
- **GET** `/api/registries/{id}/columns` - Get column mappings for registry
- **GET** `/api/registries/{id}/data` - Get registry data with filtering
- **POST** `/api/registries/{id}/data` - Create new record
- **PUT** `/api/registries/{id}/data/{recordId}` - Update record
- **DELETE** `/api/registries/{id}/data/{recordId}` - Delete record
- **POST** `/api/registries` - Create new registry (admin only)
- **PUT** `/api/registries/{id}` - Update registry (admin only)
- **DELETE** `/api/registries/{id}` - Delete registry (admin only)

#### Access Control
- **GET** `/api/registries/access/{userId}` - Get user's registry access
- **PUT** `/api/registries/access/{userId}/{registryId}` - Update user access (admin only)

### Request Headers

All authenticated requests include:
```
Authorization: Bearer <token>
Content-Type: application/json
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## Logging

The application includes comprehensive logging for debugging:

- **DEBUG**: Development-only detailed logs
- **INFO**: General information and flow tracking
- **WARN**: Warning messages for unusual situations
- **ERROR**: Error messages with stack traces

Logs include timestamps and can be viewed in the browser console.

## Components

### LoginPage
Modern authentication interface with:
- Form validation
- Error handling
- Loading states
- Responsive design

### DashboardPage
Main application interface featuring:
- User welcome message
- Navigation cards for different sections
- User information display
- Logout functionality

### ProtectedRoute
Route guard component that:
- Checks authentication status
- Shows loading state during verification
- Redirects unauthenticated users to login

## Security

- **Token-based Authentication**: Secure Bearer Token system
- **Protected Routes**: Client-side route guards
- **Automatic Token Validation**: Tokens verified on mount
- **Secure Storage**: localStorage for token persistence
- **Auto-logout**: Invalid tokens trigger automatic logout

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Backend Requirements

The application requires a backend Web API that provides:

1. **Authentication Endpoint**: `/api/auth/login`
   - Accepts: `{ username: string, password: string }`
   - Returns: `{ token: string, user: User, expiresIn: number }`

2. **Token Verification**: `/api/auth/verify`
   - Accepts: Bearer token in Authorization header
   - Returns: User object if valid

3. **Logout Endpoint**: `/api/auth/logout`
   - Accepts: Bearer token in Authorization header
   - Returns: Success status

4. **Microsoft SQL Server**: Database for user storage and authentication

## Future Enhancements

- Admin user interface for managing users
- Admin interface for creating/editing registries
- Advanced search across all registries
- Report generation and export (PDF, Excel)
- Audit logging for all changes
- Bulk import/export functionality
- Advanced filtering with multiple criteria
- Custom views and saved filters
- Email notifications for changes
- File attachment support

## Support

For issues and questions, please create an issue in the GitHub repository.
