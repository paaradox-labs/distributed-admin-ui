# Admin Dashboard

A modern, responsive admin dashboard built with React and TypeScript. This project serves as the frontend interface for managing various administrative tasks with a clean and intuitive user experience.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Available Commands](#available-commands)
- [Getting Started](#getting-started)
- [Development Guidelines](#development-guidelines)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This is an early-stage React application that provides the foundation for a comprehensive admin dashboard. It includes authentication pages, routing configuration, and core page layouts ready for further development.

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.4 | UI Framework |
| Vite | 8.0.4 | Build Tool |
| TypeScript | ~6.0 | Type Safety |
| React Router | 7.14.0 | Client-side Routing |
| Vitest | 4.1.4 | Testing Framework |
| ESLint | 9.39.4 | Code Linting |
| React Testing Library | - | Testing Utilities |

## ✨ Features

- **Client-side Routing** - Seamless navigation between pages using React Router
- **Component-based Architecture** - Modular and reusable React components
- **TypeScript Support** - Full type safety across the codebase
- **Testing Ready** - Vitest configured with React Testing Library
- **Code Quality** - ESLint configured for consistent code style
- **Responsive Design** - Works on desktop and mobile devices
- **Authentication Flow** - Login page with form validation
- **Dashboard Views** - Home page and category management interface
- **Environment Configuration** - Support for different environments via .env files

## 📁 Project Structure

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
├── eslint.config.js           # ESLint configuration
├── .env                       # Environment variables
├── .env.example               # Example environment variables
└── README.md
```

## 🛣️ Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | HomePage | Main dashboard view |
| `/categories` | Categories | Category management interface |
| `/auth/login` | LoginPage | User authentication page |

## 🔧 Available Commands

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

# Run tests with coverage
pnpm test --coverage
```

## 🚀 Getting Started

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

## 📝 Development Guidelines

- Use functional components with hooks
- Follow TypeScript best practices
- Write tests for new components
- Run `pnpm lint` before committing
- Keep components small and focused
- Use meaningful variable and function names
- Follow the existing code style in the project

## 🔐 Environment Variables

The project uses environment variables for configuration. Copy `.env.example` to `.env` and update as needed:

```
# VITE_API_URL - Base URL for API endpoints
VITE_API_URL=http://localhost:3000/api

# Add other environment variables as needed
```

> **Note**: Environment variables must be prefixed with `VITE_` to be exposed to the Vite-built application.

## 🧪 Testing

This project uses Vitest for testing with React Testing Library.

```bash
# Run tests in watch mode
pnpm test

# Run tests once and exit
pnpm test --run

# Run tests with coverage report
pnpm test --coverage
```

## 🤝 Contributing

Feel free to contribute to this project by submitting pull requests or opening issues for bugs and feature requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and for internal use only.

---

*Last updated: April 2026*