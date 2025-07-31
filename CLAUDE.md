# Pomelo Project Guide

## Tech Stack

### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (using Rolldown)
- **Package Manager**: pnpm
- **State Management**: TanStack Query
- **Styling**: TailwindCSS v4
- **UI Components**: ShadCN (Radix UI primitives)
- **Data Visualization**: Recharts
- **Molecular Visualization**: Molstar, @nitro-bio/molstar-easy
- **Sequence Viewers**: @nitro-bio/sequence-viewers

### Backend
- **Framework**: FastAPI (Python)
- **Database**: SQLite
- **ORM**: Raw SQL
- **Task Management**: Invoke

## Development Commands

### Frontend

```bash
# Run TypeScript check and ESLint
pnpm lint

# Check/fix formatting
pnpm format:fix
```

### Backend

```bash
uv run invoke lint
```

## Code Conventions

### Deployment

- If you make any new backend modules make sure to add a copy command in Dockerfile.production!
- When adding new modules or making significant structural changes, update the directory structure in README.md


## Code Style Preferences

- **Frontend**:

  - TypeScript with strict typing
  - Functional components with hooks pattern
  - Explicit return types on functions
  - Use lazy loading for heavy components (lazy imports with Suspense)

- **Backend**:
  - Modern Python with type annotations
  - Service-oriented architecture
  - Comprehensive docstrings
  - Implement soft deletion rather than hard deletion when appropriate
  - **Prefer functional services over class-based services**
  - Services should be modules with functions, not classes with methods
  - Use module-level constants and global instances where appropriate

## Defensive Programming Guidelines

- **NEVER use Optional unless strictly necessary**
- Avoid returning None values as that create uncertainty for callers
- avoid using `any` or `Any`. use `unknown` if you must.
- Validate inputs early and fail fast with meaningful error messages
