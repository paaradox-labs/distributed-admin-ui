# MERN Space - Admin UI

A multi-tenant restaurant management admin dashboard built with React and TypeScript. Provides a frontend interface for managing users, restaurant tenants, products (menu items), and orders with role-based access control. Authentication is handled via HTTP-only cookies with automatic token refresh.

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

This is a multi-tenant restaurant management admin dashboard built as part of a distributed microservices architecture. It communicates with separate **auth** and **catalog** backend services via REST APIs. Admins can manage users, restaurants (tenants), and products across all tenants. Managers are scoped to their assigned restaurant and can manage products only.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | ^19.2.4 | UI Framework |
| Vite | ^8.0.4 | Build Tool |
| TypeScript | ~6.0.2 | Type Safety |
| React Router | ^7.14.0 | Client-side Routing |
| Ant Design | ^6.3.5 | UI Component Library |
| @ant-design/icons | ^6.1.1 | Icon Library |
| Axios | ^1.15.0 | HTTP Client |
| TanStack Query | ^5.99.0 | Server State Management |
| Zustand | ^5.0.12 | Client State Management |
| date-fns | ^4.3.0 | Date Formatting |
| lodash | ^4.18.1 | Utility Functions |
| Vitest | ^4.1.4 | Testing Framework |
| ESLint | ^10.0.1 | Code Linting |
| pnpm | — | Package Manager |

## Features

- **HTTP-Only Cookie Auth** - Secure authentication without client-side token storage
- **Automatic Token Refresh** - Axios interceptor silently refreshes expired tokens
- **Role-Based Access Control** - `admin` sees all modules; `manager` is restricted to products
- **Protected Routes** - Authenticated layouts redirect unauthorized users to login
- **Persistent Sessions** - User session restored on page refresh via self endpoint
- **Multi-Tenant Management** - CRUD for restaurant tenants (admin only)
- **User Management** - CRUD for users with role & tenant assignment (admin only)
- **Product Management** - CRUD with dynamic forms driven by per-category pricing & attribute schemas
- **Product Image Upload** - JPG/PNG upload with client-side validation
- **Order Management** - Order listing with mobile-responsive table, status change via dropdown, expandable row details
- **Order Detail View** - Single order view with cart items, customer info, and inline status management
- **Promo Management** - CRUD for discount coupons with tenant association
- **Mobile Responsive** - All data tables use `Grid.useBreakpoint()` to hide columns and show expandable details on small screens
- **Dashboard Analytics** - Order statistics, sales figures, recent orders list, placeholder chart
- **Filter & Pagination** - Search, dropdown filters, role/category/restaurant toggles across all tables
- **Dynamic Forms** - Pricing and attribute fields render based on selected category's configuration
- **Ant Design UI** - Production-ready component library with custom theme (primary: `#F65F42`)
- **Client-side Routing** - Seamless navigation using React Router v7
- **Server State Management** - TanStack Query for API data fetching, caching, and mutations
- **Component-based Architecture** - Modular and reusable React components
- **TypeScript Support** - Full type safety across the codebase
- **Testing Ready** - Vitest configured with React Testing Library
- **Code Quality** - ESLint configured for consistent code style

## Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   └── icons/                     # Inline SVG icon components
│   │       ├── Logo.tsx
│   │       ├── Home.tsx
│   │       ├── BasketIcon.tsx
│   │       ├── FoodIcon.tsx
│   │       ├── UserIcon.tsx
│   │       ├── GiftIcon.tsx
│   │       ├── BarChart.tsx
│   │       └── CategoryIcon.tsx
│   ├── hooks/
│   │   └── usePermission.ts           # Role-based permission hook
│   ├── http/
│   │   ├── api.ts                     # API endpoint functions (auth, users, tenants, categories, products, orders, promos)
│   │   └── client.ts                  # Axios instance with token refresh interceptor
│   ├── layouts/
│   │   ├── Dashboard.tsx              # Authenticated layout: sidebar, header, role-based menu, logout
│   │   ├── NonAuth.tsx                # Non-authenticated layout (redirects if logged in)
│   │   └── Root.tsx                   # Root layout; fetches current user on mount
│   ├── pages/
│   │   ├── login/
│   │   │   ├── login.tsx              # Login page with Ant Design form
│   │   │   └── login.spec.tsx         # Login page unit tests
│   │   ├── HomePage.tsx               # Dashboard home with stats and recent orders list
│   │   ├── users/
│   │   │   ├── Users.tsx              # User CRUD: paginated table, drawer forms, role/tenant management
│   │   │   ├── UsersFilter.tsx        # User filter bar (search, role select)
│   │   │   └── forms/UserForm.tsx     # User creation/edit form
│   │   ├── tenants/
│   │   │   ├── Tenants.tsx            # Restaurant CRUD: paginated table, drawer forms
│   │   │   ├── TenantFilter.tsx       # Tenant filter bar (search)
│   │   │   └── forms/TenantForm.tsx   # Tenant creation form (name, address)
│   │   ├── products/
│   │   │   ├── Products.tsx           # Product CRUD: table, filters, drawer forms
│   │   │   ├── ProductsFilter.tsx     # Product filter bar (search, category, restaurant, published)
│   │   │   ├── forms/
│   │   │   │   ├── ProductForm.tsx    # Main product form with dynamic sections
│   │   │   │   ├── ProductImage.tsx   # Image upload with JPG/PNG validation
│   │   │   │   ├── Pricing.tsx        # Dynamic pricing fields from category schema
│   │   │   │   └── Attributes.tsx     # Dynamic attribute fields from category schema
│   │   │   └── helpers.ts             # FormData builder for product creation
│   │   ├── orders/
│   │   │   ├── Orders.tsx             # Order listing: mobile-responsive table, expandable rows, status tags
│   │   │   └── SingleOrder.tsx        # Order detail: cart items list, customer card, inline status change
│   │   └── promos/
│   │       ├── Promos.tsx             # Coupon CRUD: paginated table, drawer forms
│   │       ├── PromosFilter.tsx       # Promo filter bar (search)
│   │       └── forms/
│   │           └── PromoForm.tsx      # Coupon creation/edit form
│   ├── types/
│   │   └── types.ts                   # TypeScript types (User, Tenant, Product, Category, Order, Coupon, etc.)
│   ├── constants.ts                   # Pagination and color mapping constants
│   ├── store.ts                       # Zustand auth store (user state, setUser, logout)
│   ├── router.tsx                     # Application routing with nested layouts
│   ├── main.tsx                       # Entry point: QueryClient, ConfigProvider, RouterProvider
│   └── index.css                      # Global styles
├── public/                            # Static assets
├── index.html                         # HTML entry point
├── package.json                       # Project dependencies and scripts
├── tsconfig.json                      # TypeScript project references config
├── tsconfig.app.json                  # App TypeScript config
├── tsconfig.node.json                 # Node TypeScript config
├── vite.config.ts                     # Vite build + Vitest config
├── eslint.config.js                   # ESLint flat config (TS, React hooks, React refresh)
├── setupTest.ts                       # Vitest setup (matchMedia, computedStyle mocks)
├── .env                               # Environment variables (local)
├── .env.example                       # Example environment variables
└── README.md
```

## Routes

| Path | Layout | Component | Auth Required | Role Restriction | Description |
|------|--------|-----------|---------------|-----------------|-------------|
| `/` | Root > Dashboard | HomePage | Yes | None | Dashboard with stats and recent orders |
| `/users` | Root > Dashboard | Users | Yes | Admin only | User management |
| `/restaurants` | Root > Dashboard | Tenants | Yes | Admin only | Restaurant tenant management |
| `/products` | Root > Dashboard | Products | Yes | None | Product management |
| `/orders` | Root > Dashboard | Orders | Yes | None | Order listing with status tags |
| `/orders/:orderId` | Root > Dashboard | SingleOrder | Yes | None | Order detail view with inline status change |
| `/promos` | Root > Dashboard | Promos | Yes | Admin only | Discount coupon management |
| `/auth/login` | Root > NonAuth | LoginPage | No | None | User authentication page |

### Route Hierarchy

```
<Root>                                    # Fetches self (current user) on mount
  <Dashboard />                           # Redirects to /auth/login if user === null
    <HomePage />                          # At path "/"
    <Users />                             # At path "/users"
    <Tenants />                           # At path "/restaurants"
    <Products />                          # At path "/products"
    <Orders />                            # At path "/orders"
    <SingleOrder />                       # At path "/orders/:orderId"
    <Promos />                            # At path "/promos"
  <NonAuth />                             # Redirects to "/" if user !== null
    <LoginPage />                         # At path "/auth/login"
```

The sidebar menu adapts based on the user's role — `manager` users only see Dashboard, Orders, and Products.

## Authentication Flow

### Mechanism

The app uses HTTP-only cookies for authentication. There is no JWT token storage in the frontend — the backend sets cookies that are automatically sent with requests.

### Login Flow

1. User navigates to `/auth/login`
2. `NonAuth` layout checks if `user !== null` — if authenticated, redirects to `/`
3. User submits email + password via the Ant Design form
4. `POST /api/auth/login` is called via TanStack Query mutation
5. On success, `GET /api/auth/self` fetches the user profile
6. Permission check: Only `admin` or `manager` roles are allowed
7. If unauthorized, `POST /api/auth/logout` is called and the store is cleared
8. If authorized, user data is saved to the Zustand store and the dashboard is rendered

### Token Refresh

1. Any Axios request returns a 401 response
2. The response interceptor catches it and calls `POST /api/auth/refresh`
3. If refresh succeeds, the original request is retried (retried at most once)
4. If refresh fails, the user is logged out (store cleared)

### Session Restore (Page Refresh)

1. On navigation, `Root` layout runs `GET /api/auth/self`
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
# Base URL for all backend API endpoints
VITE_BACKEND_API_URL=http://localhost:8000
```

> **Note**: Environment variables must be prefixed with `VITE_` to be exposed to the Vite-built application. The backend exposes two service prefixes: `/api/auth` (auth, users, tenants) and `/api/catalog` (categories, products).

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

*Last updated: June 2026*
