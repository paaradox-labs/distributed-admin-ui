# Admin Dashboard

A modern, responsive admin dashboard built with React and TypeScript. This project serves as the frontend interface for managing various administrative tasks with a clean and intuitive user experience. Authentication is handled via HTTP-only cookies with automatic token refresh.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Authentication Flow](#authentication-flow)
- [Available Commands](#available-commands)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

This is an early-stage React application that provides the foundation for a comprehensive admin dashboard. It includes authentication with HTTP-only cookies, role-based access control (admin/manager only), automatic token refresh, protected routing, and a scalable architecture with Ant Design UI components.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.4 | UI Framework |
| Vite | ^8.0.4 | Build Tool |
| TypeScript | ~6.0.2 | Type Safety |
| React Router | ^7.14.0 | Client-side Routing |
| Ant Design | ^6.3.5 | UI Component Library |
| Axios | ^1.15.0 | HTTP Client |
| TanStack Query | ^5.99.0 | Server State Management |
| Zustand | ^5.0.12 | Client State Management |
| Vitest | ^4.1.4 | Testing Framework |
| ESLint | ^9.39.4 | Code Linting |

## Features

- **HTTP-Only Cookie Auth** - Secure authentication without client-side token storage
- **Automatic Token Refresh** - Axios interceptor silently refreshes expired tokens
- **Role-Based Access Control** - Only `admin` and `manager` roles are authorized
- **Protected Routes** - Authenticated layouts redirect unauthorized users to login
- **Persistent Sessions** - User session restored on page refresh via self endpoint
- **Ant Design UI** - Production-ready component library with consistent design
- **Client-side Routing** - Seamless navigation using React Router v7
- **Server State Management** - TanStack Query for API data fetching and mutations
- **Component-based Architecture** - Modular and reusable React components
- **TypeScript Support** - Full type safety across the codebase
- **Testing Ready** - Vitest configured with React Testing Library
- **Code Quality** - ESLint configured for consistent code style

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   └── icons/
│   │       └── Logo.tsx              # Inline SVG logo component
│   ├── hooks/
│   │   └── usePermission.ts          # Role-based permission hook
│   ├── http/
│   │   ├── api.ts                    # API endpoint functions (login, self, logout)
│   │   └── client.ts                 # Axios instance with token refresh interceptor
│   ├── layouts/
│   │   ├── Dashboard.tsx             # Authenticated layout (protected route wrapper)
│   │   ├── NonAuth.tsx               # Non-authenticated layout (redirects if logged in)
│   │   └── Root.tsx                  # Root layout; fetches current user on mount
│   ├── pages/
│   │   ├── login/
│   │   │   ├── login.tsx             # Login page with Ant Design form
│   │   │   └── login.spec.tsx        # Login page unit tests
│   │   └── HomePage.tsx              # Main dashboard/home page (placeholder)
│   ├── types/
│   │   └── types.ts                  # TypeScript type definitions
│   ├── index.css                     # Global styles
│   ├── main.tsx                      # Application entry point with providers
│   ├── router.tsx                    # Application routing configuration
│   └── store.ts                      # Zustand auth store (user state, login/logout)
├── public/                           # Static assets
├── index.html                        # HTML entry point
├── package.json                      # Project dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite build configuration
├── eslint.config.js                  # ESLint configuration
├── .env                              # Environment variables (local)
├── .env.example                      # Example environment variables
└── README.md
```

## Routes

| Path | Layout | Component | Auth Required | Description |
|------|--------|-----------|---------------|-------------|
| `/` | Root > Dashboard | HomePage | Yes | Main dashboard view |
| `/auth/login` | Root > NonAuth | LoginPage | No | User authentication page |

### Route Hierarchy

```
<Root>                                    # Fetches self (current user) on mount
  <Dashboard />                           # Redirects to /auth/login if user === null
    <HomePage />                          # At path "/"
  <NonAuth />                             # Redirects to "/" if user !== null
    <LoginPage />                         # At path "/auth/login"
```

## Authentication Flow

### Mechanism

The app uses HTTP-only cookies for authentication. There is no JWT token storage in the frontend — the backend sets cookies that are automatically sent with requests.

### Login Flow

1. User navigates to `/auth/login`
2. `NonAuth` layout checks if `user !== null` — if authenticated, redirects to `/`
3. User submits email + password via the Ant Design form
4. `POST /auth/login` is called via TanStack Query mutation
5. On success, `GET /auth/self` fetches the user profile
6. Permission check: Only `admin` or `manager` roles are allowed
7. If unauthorized, `POST /auth/logout` is called and the store is cleared
8. If authorized, user data is saved to the Zustand store and the dashboard is rendered

### Token Refresh

1. Any Axios request returns a 401 response
2. The response interceptor catches it and calls `POST /auth/refresh`
3. If refresh succeeds, the original request is retried
4. If refresh fails, the user is logged out (store cleared)

### Session Restore (Page Refresh)

1. On navigation, `Root` layout runs `GET /auth/self`
2. If the cookie is still valid, user data is restored to the store
3. If the backend returns 401, user stays logged out and is redirected to login

## Available Commands

```bash
# Install dependencies
pnpm install

# Start development server with hot reload
pnpm dev

# Build for production
pnpm build

# Run linting checks
pnpm lint

# Preview production build locally
pnpm preview

# Run tests in watch mode
pnpm test

# Run tests once and exit
pnpm test --run

# Run tests with coverage
pnpm test --coverage
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   pnpm dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## Development Guidelines

- Use functional components with hooks
- Follow TypeScript best practices
- Write tests for new components
- Run `pnpm lint` before committing
- Keep components small and focused
- Use meaningful variable and function names
- Follow the existing code style in the project

## Environment Variables

The project uses environment variables for configuration. Copy `.env.example` to `.env` and update as needed:

```
# VITE_BACKEND_API_URL - Base URL for backend API endpoints
VITE_BACKEND_API_URL=http://localhost:5501

# Add other environment variables as needed
```

> **Note**: Environment variables must be prefixed with `VITE_` to be exposed to the Vite-built application.

## Testing

This project uses Vitest for testing with React Testing Library.

```bash
# Run tests in watch mode
pnpm test

# Run tests once and exit
pnpm test --run

# Run tests with coverage report
pnpm test --coverage
```

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues for bugs and feature requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and for internal use only.

---

*Last updated: May 2026*
