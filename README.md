# Admin Dashboard

A modern, responsive admin dashboard built with React and TypeScript. This project serves as the frontend interface for managing various administrative tasks with a clean and intuitive user experience.

## Overview

This is an early-stage React application that provides the foundation for a comprehensive admin dashboard. It includes authentication pages, routing configuration, and core page layouts ready for further development.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Framework |
| Vite | 8.0.4 | Build Tool |
| TypeScript | ~6.0 | Type Safety |
| React Router | 7.14.0 | Client-side Routing |
| Vitest | 4.1.4 | Testing Framework |
| ESLint | 9.39.4 | Code Linting |

## Features

- **Client-side Routing** - Seamless navigation between pages using React Router
- **Component-based Architecture** - Modular and reusable React components
- **TypeScript Support** - Full type safety across the codebase
- **Testing Ready** - Vitest configured with React Testing Library
- **Code Quality** - ESLint configured for consistent code style

## Project Structure

```
admin-dashboard/
├── src/
│   ├── pages/
│   │   ├── HomePage.tsx        # Main dashboard/home page
│   │   ├── Categories.tsx      # Categories management page
│   │   └── login/
│   │       ├── login.tsx       # Login page component
│   │       └── login.spec.tsx  # Login page unit tests
│   ├── router.tsx             # Application routing configuration
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles and base theming
├── public/                    # Static assets
├── index.html                 # HTML entry point
├── package.json               # Project dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite build configuration
└── eslint.config.js           # ESLint configuration
```

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Main dashboard view |
| `/categories` | Categories | Category management interface |
| `/auth/login` | LoginPage | User authentication page |

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

# Run tests in watch mode for development
pnpm test
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
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## Development Guidelines

- Use functional components with hooks
- Follow TypeScript best practices
- Write tests for new components
- Run `pnpm lint` before committing

## Contributing

Feel free to contribute to this project by submitting pull requests or opening issues for bugs and feature requests.

## License

This project is private and for internal use only.

---