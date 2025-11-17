# Marlin - Student Productivity Platform

## Overview

Marlin/StudentAid is a comprehensive student productivity platform designed to help students organize their academic life through smart note-taking, task management, quick capture functionality, and calendar integration. The application follows a system-based design approach inspired by Notion's clean organization, Linear's crisp typography, and Asana's task clarity, focusing on functional beauty for extended study sessions.

The platform is built as a full-stack TypeScript application with a React frontend and Express backend, utilizing PostgreSQL for data persistence and Replit's OpenID Connect for authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast hot module replacement
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management with optimistic updates

**UI Component System**
- Shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Custom theming system supporting light/dark modes via context provider
- Responsive sidebar layout using Radix UI's sheet/dialog patterns for mobile

**State Management Strategy**
- Server state managed through TanStack Query with aggressive caching (staleTime: Infinity)
- Authentication state centralized in `useAuth` hook
- Theme state managed via React Context
- Form state handled by React Hook Form with Zod validation

**Design System**
- Typography: Inter (primary), JetBrains Mono (code/tags)
- Spacing system using consistent Tailwind units (2, 4, 6, 8, 12, 16, 20, 24)
- Custom color system with CSS variables for themeable components
- Component variants using class-variance-authority for consistent styling

### Backend Architecture

**Server Framework**
- Express.js with TypeScript for type-safe route handlers
- Session-based authentication using express-session
- PostgreSQL session store for persistent sessions
- Middleware pattern for request logging and error handling

**Data Access Layer**
- Drizzle ORM for type-safe database queries
- Schema-first approach with Zod validation from database schema
- Neon serverless PostgreSQL with WebSocket support
- Connection pooling via @neondatabase/serverless

**API Design**
- RESTful API endpoints under `/api` prefix
- Authentication middleware (`isAuthenticated`) protecting all data routes
- CRUD operations for: notes, tasks, folders, quick captures
- Response format: JSON with consistent error handling
- Request body parsing with raw body preservation for webhook verification

**Authentication Flow**
- OpenID Connect integration via Replit Auth
- Passport.js strategy for OIDC authentication
- User profile automatically synced on login (upsert pattern)
- Session management with 7-day TTL
- Refresh token rotation handled automatically

### Database Schema

**Core Entities**
- `users`: OAuth user profiles (id, email, firstName, lastName, profileImageUrl)
- `notes`: Rich text notes with folder/tag organization (userId, title, content, folderId, tags)
- `tasks`: Task tracking with priorities and due dates (userId, title, description, dueDate, priority, completed)
- `folders`: Hierarchical folder structure (userId, name, parentId)
- `quickCaptures`: Rapid idea capture (userId, content)
- `sessions`: Express session storage (sid, sess, expire)

**Relationships**
- All user-generated content tied to userId with CASCADE delete
- Folders support self-referential parent-child relationships
- Notes can belong to folders and have multiple tags (array field)

**Data Validation**
- Drizzle-Zod integration for schema-to-validator generation
- Insert schemas exported from shared/schema.ts
- Type inference from database schema to TypeScript interfaces

### Development Workflow

**Monorepo Structure**
- `/client`: React frontend application
- `/server`: Express backend with routes and middleware
- `/shared`: Shared TypeScript types and database schema
- Path aliases configured: `@/` (client), `@shared/` (shared code)

**Build Process**
- Development: `tsx` for server hot-reload, Vite dev server for client
- Production: Vite bundles client to `dist/public`, esbuild bundles server to `dist`
- Database migrations: Drizzle Kit push command for schema sync

**Environment Configuration**
- `DATABASE_URL`: Neon PostgreSQL connection string (required)
- `SESSION_SECRET`: Express session encryption key (required)
- `REPL_ID`: Replit deployment identifier (OIDC client)
- `ISSUER_URL`: OpenID Connect provider URL (defaults to Replit)

## External Dependencies

### Third-Party Services

**Replit Authentication (OpenID Connect)**
- Purpose: User authentication and identity management
- Integration: Passport.js OIDC strategy with automatic user provisioning
- Session management via PostgreSQL-backed session store

**Neon Serverless PostgreSQL**
- Purpose: Primary database for all application data
- Features: WebSocket connections for serverless environments, connection pooling
- Configuration: Drizzle ORM with PostgreSQL dialect

### Key NPM Packages

**UI & Styling**
- `@radix-ui/*`: Accessible component primitives (40+ packages)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Component variant management
- `lucide-react`: Icon library

**Data & State Management**
- `@tanstack/react-query`: Server state management and caching
- `drizzle-orm`: Type-safe SQL query builder
- `drizzle-zod`: Schema validation generation
- `react-hook-form`: Form state management
- `zod`: Runtime type validation

**Authentication & Sessions**
- `passport`: Authentication middleware
- `openid-client`: OpenID Connect client implementation
- `express-session`: Session management
- `connect-pg-simple`: PostgreSQL session store

**Development Tools**
- `vite`: Frontend build tool and dev server
- `tsx`: TypeScript execution for development
- `esbuild`: Production server bundling
- `@replit/vite-plugin-*`: Replit-specific development enhancements