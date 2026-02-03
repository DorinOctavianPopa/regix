# Records Archive Application

A modern Records Archive Application built with React and TypeScript, featuring secure authentication and a comprehensive dashboard for managing archived records.

## Features

- **Authentication System**: Secure login with Microsoft Authentication model
- **Bearer Token Authorization**: All API calls use Bearer Token authentication
- **Microsoft SQL Server Backend**: Database management via SQL Server
- **Protected Routes**: Dashboard and other features accessible only after authentication
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
│   └── ProtectedRoute.tsx    # Route guard for authentication
├── contexts/         # React Context providers
│   └── AuthContext.tsx       # Authentication state management
├── pages/           # Page components
│   ├── LoginPage.tsx         # Login/Authentication page
│   └── DashboardPage.tsx     # Main dashboard after login
├── services/        # API and external services
│   └── auth.service.ts       # Authentication API service
├── types/           # TypeScript type definitions
│   └── auth.types.ts         # Authentication-related types
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

## API Integration

The application communicates with a backend Web API using Bearer Token authentication.

### API Endpoints

- **POST** `/api/auth/login` - Authenticate user and receive token
- **POST** `/api/auth/logout` - Logout and invalidate token
- **GET** `/api/auth/verify` - Verify token validity

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

- Records management interface
- Search functionality
- Report generation
- User management
- Role-based permissions
- File upload and storage
- Advanced filtering and sorting

## Support

For issues and questions, please create an issue in the GitHub repository.
