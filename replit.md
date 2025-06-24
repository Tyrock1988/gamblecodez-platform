# GambleCodez - Referral Links Management System

## Overview

GambleCodez is a full-stack web application for managing and displaying gambling referral links and promotions. The application features a public-facing interface for browsing links and an admin panel for content management. It's built with a modern React frontend, Express.js backend, and PostgreSQL database, deployed on Replit with integrated authentication.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with hot module replacement
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack React Query for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type sharing
- **Tables**: 
  - `users` - Replit Auth user profiles
  - `sessions` - Session storage for authentication
  - `links` - Referral links with categories and metadata

## Key Components

### Authentication System
- Uses Replit's OpenID Connect for authentication
- Session-based authentication with PostgreSQL storage
- Automatic user profile creation and updates
- Protected admin routes with middleware

### Link Management
- Categorized links (US, Non-US, Everywhere, Faucets, Socials)
- Tagging system (KYC, No-KYC, VPN support)
- Promotional text and pinning capabilities
- Click tracking for analytics

### Content Organization
- **Categories**: us, non-us, everywhere, faucet, socials
- **Tags**: kyc, no-kyc, vpn for filtering
- **Status Management**: Active/inactive links, pinned promotions
- **Analytics**: Click counting and statistics

## Data Flow

1. **Public Access**: Landing page displays all link categories without authentication
2. **Authentication Flow**: Admin login via Replit Auth redirects through OpenID Connect
3. **Content Management**: Authenticated admins can create, edit, and manage links
4. **Link Interaction**: Public users can click links (tracked) and copy formatted lists
5. **Data Persistence**: All changes saved to PostgreSQL via Drizzle ORM

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with extensive Radix UI components via shadcn/ui
- **Data Fetching**: TanStack React Query for caching and synchronization
- **Styling**: Tailwind CSS with custom design system
- **Forms**: React Hook Form with Zod schema validation

### Backend Dependencies
- **Database**: Neon PostgreSQL serverless database
- **Authentication**: Replit Auth integration
- **ORM**: Drizzle with automatic migrations
- **Session Storage**: PostgreSQL-backed sessions via connect-pg-simple

### Development Tools
- **Build**: Vite for frontend bundling, esbuild for backend
- **Development**: tsx for TypeScript execution in development
- **Database**: Drizzle Kit for schema management and migrations

## Deployment Strategy

### Replit Environment
- **Modules**: nodejs-20, web, postgresql-16
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds frontend, esbuild bundles backend
- **Deployment**: Autoscale deployment with health checks on port 5000

### Build Process
1. Frontend builds to `dist/public` directory
2. Backend bundles to `dist/index.js` with external packages
3. Static files served from backend in production
4. Environment variables managed through Replit secrets

### Database Setup
- PostgreSQL database provisioned automatically
- Drizzle migrations run via `npm run db:push`
- Session table and user tables created automatically
- Schema shared between frontend and backend via `shared/` directory

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 24, 2025. Initial setup