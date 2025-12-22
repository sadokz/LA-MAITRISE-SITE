# AI Development Rules for LA MAITRISE ENGINEERING

## Tech Stack Overview

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui built on Radix UI primitives
- **State Management**: React Query (TanStack Query) for server state, React Context for client state
- **Routing**: React Router v6
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with Row Level Security
- **Storage**: Supabase Storage for media files
- **Deployment**: Lovable.dev platform

## Library Usage Rules

### UI & Styling
- Use **shadcn/ui** components whenever possible for consistent design
- Extend Tailwind classes for custom styling rather than writing raw CSS
- Use the existing color palette defined in tailwind.config.ts
- Follow the established design system (corporate orange, professional grays)

### Data Management
- Use **React Query** for all server state management
- Implement proper caching and background data synchronization
- Use Supabase client for database operations
- Always implement Row Level Security (RLS) for database tables

### Components
- Create new components in the `src/components` directory
- Use TypeScript interfaces for component props
- Implement responsive design with Tailwind's mobile-first utilities
- Use React Context for global state (e.g., EditModeContext)

### Routing & Pages
- Add new pages in `src/pages` directory
- Configure routes in `src/App.tsx`
- Use React Router's declarative routing

### Authentication
- Use the existing `useAuth` hook for authentication state
- Implement proper session management with Supabase Auth
- Protect admin routes using route guards

### Admin Features
- Use the existing admin context and components
- Implement edit mode functionality through `EditModeContext`
- Follow the pattern established in other admin components

### Supabase Integration
- Always use the provided Supabase client from `@/integrations/supabase/client`
- Implement proper error handling for database operations
- Use Supabase Storage for file uploads
- Follow security best practices with RLS policies