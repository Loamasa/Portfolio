# Portfolio & CV Manager - Bolt.New Integration Plan

## Project Overview

**Project Name:** Portfolio & CV Manager
**Current Tech Stack:** Full-stack application with MySQL/TiDB, Drizzle ORM, tRPC, React, Manus OAuth
**Target Environment:** Bolt.New with Supabase PostgreSQL
**Integration Date:** November 3, 2025
**Last Updated:** November 3, 2025
**Document Version:** 1.2
**Status:** Phase 3 Complete - Authentication Fully Implemented

---

## Understanding the Bolt.New Environment

### What is Bolt.New?

Bolt.New is a browser-based development environment that enables rapid full-stack application development without local setup. It provides:
- **Instant Development Server**: Runs Vite dev server automatically
- **Integrated Supabase**: Pre-configured PostgreSQL database with authentication
- **Browser-Based IDE**: Complete development environment in the browser
- **Zero Configuration**: No local Node.js, npm, or database installation required
- **Live Preview**: Real-time preview of changes
- **Git Integration**: Built-in version control

### Key Technical Constraints

**Environment Variables:**
- ALL client-side variables MUST use `VITE_` prefix
- Supabase credentials are pre-configured in `.env`:
  - `VITE_SUPABASE_URL` - Supabase project URL
  - `VITE_SUPABASE_ANON_KEY` - Public anon key for client-side operations
- Environment variables are automatically available via `import.meta.env`

**Database Access:**
- Supabase PostgreSQL is the ONLY supported database
- Database operations via:
  1. **Supabase Client** (`@supabase/supabase-js`) - For CRUD operations
  2. **Supabase MCP Tools** - For migrations and SQL execution
  3. **Direct SQL** - Via `mcp__supabase__execute_sql` tool
- NO local database required
- NO database connection strings needed (handled by Supabase client)

**Authentication:**
- Supabase Auth is pre-integrated via `auth.users` table
- User authentication handled by Supabase SDK
- NO custom authentication server needed
- Session management automatic via Supabase client

**Development Server:**
- Vite dev server runs automatically on port 5173
- NEVER manually start dev server (`npm run dev` not needed)
- Hot module replacement (HMR) enabled by default
- Build command: `npm run build` (runs `tsc && vite build`)

**File System:**
- All code in `/tmp/cc-agent/[session-id]/project/` directory
- Changes persist during session
- Standard npm project structure
- Uses standard package.json for dependencies

### Supabase MCP Tools Available

The following tools are available for database operations:

1. **`mcp__supabase__list_tables`** - List all database tables
2. **`mcp__supabase__list_migrations`** - View applied migrations
3. **`mcp__supabase__apply_migration`** - Execute SQL migration files
4. **`mcp__supabase__execute_sql`** - Run direct SQL queries
5. **`mcp__supabase__list_extensions`** - List PostgreSQL extensions
6. **`mcp__supabase__list_edge_functions`** - List Supabase Edge Functions
7. **`mcp__supabase__deploy_edge_function`** - Deploy serverless functions

**Migration Best Practices:**
- Use `apply_migration` with descriptive filename in snake_case
- Include comprehensive migration comments explaining changes
- Migrations are permanent - test before applying
- All migrations tracked in `supabase/migrations/` directory

### Technology Stack in Bolt.New

**Frontend (Client-Side):**
- React 18+ with TypeScript
- Vite as build tool and dev server
- Wouter for client-side routing
- TailwindCSS for styling
- shadcn/ui for UI components
- @tanstack/react-query for data fetching/caching

**Backend (Serverless):**
- Supabase PostgreSQL for data persistence
- Supabase Auth for authentication
- Supabase Row Level Security (RLS) for authorization
- Supabase Edge Functions for serverless compute (optional)
- No traditional backend server required

**Data Layer:**
- Direct Supabase client calls from React components
- React Query for caching and state management
- No tRPC, no Express, no traditional API routes
- All database access via Supabase client SDK

### Database Schema Conventions

**Naming Conventions:**
- Tables: `snake_case` (e.g., `cv_profiles`, `blog_posts`)
- Columns: `snake_case` (e.g., `user_id`, `created_at`)
- Primary Keys: Always `id` column with UUID type
- Foreign Keys: `{table}_id` format (e.g., `user_id`)
- Timestamps: `created_at`, `updated_at` (timestamptz type)

**Data Types:**
- IDs: `uuid` with `DEFAULT gen_random_uuid()`
- Booleans: `boolean` (NOT integers)
- JSON: `jsonb` (NOT json or text)
- Timestamps: `timestamptz` (timestamp with time zone)
- Text: `text` (NOT varchar unless length constraint needed)

**Required Features:**
- Row Level Security (RLS) enabled on ALL tables
- RLS policies for authenticated access: `auth.uid() = user_id`
- Foreign key constraints to `auth.users(id)` with `ON DELETE CASCADE`
- Indexes on foreign keys and frequently queried columns
- Automatic `updated_at` triggers using `update_updated_at_column()` function

### Working Outside Bolt.New

If developing outside Bolt.New environment, you need:

1. **Local Development Setup:**
   ```bash
   # Install Node.js 18+ and npm
   npm install
   npm run dev  # Start Vite dev server on localhost:5173
   ```

2. **Supabase Project:**
   - Create account at https://supabase.com
   - Create new project (free tier available)
   - Get credentials from Project Settings → API
   - Update `.env` with your credentials

3. **Database Migrations:**
   - Install Supabase CLI: `npm install -g supabase`
   - Link project: `supabase link --project-ref YOUR_PROJECT_REF`
   - Apply migrations: `supabase db push`
   - Or use Supabase Dashboard SQL Editor

4. **Environment Variables:**
   ```bash
   # .env file
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

5. **TypeScript Types:**
   ```bash
   # Generate types from Supabase schema
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
   ```

### Common Patterns in Bolt.New

**Data Fetching:**
```typescript
import { supabase } from '@/lib/supabase';
import { useQuery } from '@tanstack/react-query';

function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });
}
```

**Data Mutation:**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project) => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .insert(project)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });
}
```

**Authentication:**
```typescript
import { supabase } from '@/lib/supabase';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

---

## Current Implementation Status

### Completed Phases

#### Phase 1: Project Foundation & Setup ✅ COMPLETE
- Project structure established with proper directory organization
- All dependencies installed and configured in `package.json`
- Vite development environment configured
- TypeScript configuration set up with strict mode
- TailwindCSS styling framework integrated
- Supabase client initialized in `src/lib/supabase.ts`
- Environment variables properly configured with `VITE_` prefix

#### Phase 2: Database Schema & Supabase Setup ✅ COMPLETE
**Migrations Applied:**
1. `create_cv_tables.sql` - Created 5 CV management tables
   - cv_profiles (with JSONB for core_strengths and languages)
   - cv_experiences (with JSONB for role_categories)
   - cv_education (with JSONB for education_sections)
   - cv_skills (with category grouping)
   - cv_templates (with JSONB arrays for selected IDs)

2. `create_portfolio_blog_tables.sql` - Created 3 portfolio/blog tables
   - portfolio_projects (with publish status and JSONB tags)
   - blog_posts (with unique slug constraint and JSONB tags)
   - portfolio_settings (with JSONB social_links)

3. `create_triggers_and_functions.sql` - Database automation
   - `update_updated_at_column()` function for timestamp management
   - `is_admin()` function for role checking
   - Triggers on all tables for automatic updated_at

**Security Implementation:**
- Row Level Security (RLS) enabled on all 8 tables
- 37 security policies created across all tables
- Users can only access their own data (authenticated)
- Published content is publicly readable (anon users)
- Admin role checking infrastructure in place

**Type System:**
- TypeScript types updated in `src/types/cv.ts`
- Changed from integer IDs to UUID strings
- Converted integer booleans to proper boolean types
- Added snake_case database column names with camelCase aliases
- Proper JSONB type definitions for arrays and objects

### Pending Phases

#### Phase 3: Authentication Implementation ✅ COMPLETE
**All Features Implemented:**
- ✅ Supabase Auth fully integrated (replaced Manus OAuth)
- ✅ Email/password authentication working
- ✅ Auth context and hooks created (`useAuth`)
- ✅ Login and Signup pages with forms
- ✅ Password reset flow (forgot password + reset password pages)
- ✅ Email verification status banner
- ✅ Resend verification email functionality
- ✅ Protected routes with `AuthGate` component
- ✅ Role-based access control (admin role via user_metadata)
- ✅ Admin panel protection with `requireAdmin` prop
- ✅ Hidden admin access via keyboard shortcut (A-D-M-I-N)
- ✅ Admin setup documentation created (ADMIN_SETUP.md)

**New Files Created:**
- `/src/pages/ForgotPassword.tsx`
- `/src/pages/ResetPassword.tsx`
- `/src/components/auth/ForgotPasswordForm.tsx`
- `/src/components/auth/ResetPasswordForm.tsx`
- `/src/components/auth/EmailVerificationBanner.tsx`
- `/ADMIN_SETUP.md`

**Files Modified:**
- `/src/hooks/useAuth.ts` - Added resendVerification and isEmailVerified
- `/src/components/auth/LoginForm.tsx` - Added "Forgot password?" link
- `/src/App.tsx` - Added password reset routes
- `/src/pages/CVManagerExpanded.tsx` - Added email verification banner
- `/src/pages/AdminPanel.tsx` - Added email verification banner

#### Phase 4: Data Layer Migration (CV Management) 🔄 NEXT
- Replace tRPC with Supabase client queries
- Create React Query hooks for CV data
- Update components to use new data layer
- Implement optimistic updates

#### Phase 5: Data Layer Migration (Portfolio Management) ⏳ PENDING
- Create hooks for portfolio and blog data
- Update admin panel components
- Implement public/private content views

#### Phase 6-9: Polish & Testing ⏳ PENDING
- Import/export functionality
- UI/UX improvements
- Comprehensive testing
- Documentation updates

### Known Issues

**TypeScript Compilation Errors:**
- Components still reference old integer ID types (will be fixed in Phase 4)
- Mock tRPC interface expects number IDs instead of string UUIDs
- Template JSONB array parsing needs updates
- These errors are expected at this stage and will be resolved when implementing Phase 4

**Database Schema:**
- All migrations successfully applied ✅
- All RLS policies active and enforced ✅
- All foreign key relationships established ✅
- All indexes created for performance ✅

---

## Executive Summary

This document outlines the comprehensive plan to migrate and integrate the Portfolio & CV Manager application into the Bolt.New environment with Supabase as the backend database. The application is a professional portfolio website combined with an advanced CV management system that allows users to create, manage, and export professional CVs in multiple formats.

### Key Features

1. **CV Management System**
   - Profile management with personal information
   - Work experience tracking with detailed descriptions
   - Education history management
   - Skills database with categorization
   - CV templates for different job applications
   - JSON import/export for backup and portability
   - Professional PDF export with ATS-friendly formatting

2. **Public Portfolio Website**
   - Professional landing page with hero section
   - Core strengths showcase
   - Featured projects gallery
   - Blog section for insights and articles
   - Responsive design for all devices

3. **Admin Panel**
   - Project showcase management
   - Blog post creation and management
   - Portfolio settings customization
   - Hidden access via keyboard shortcut (A-D-M-I-N)

4. **Authentication & Security**
   - Currently uses Manus OAuth
   - Role-based access control (admin vs user)
   - Protected routes and API endpoints

---

## Current Architecture Analysis

### Frontend Structure

**Framework:** React with TypeScript
**Routing:** Wouter
**UI Components:** Custom components with shadcn/ui
**State Management:** React Query (via tRPC)

**Key Pages:**
- `Home.tsx` - Public portfolio homepage
- `CVManager.tsx` - CV management interface
- `AdminPanel.tsx` - Content management dashboard
- Component files for CV sections (Profile, Experience, Education, Skills, Templates)

### Backend Structure

**API Layer:** tRPC procedures
**Database ORM:** Drizzle
**Database:** MySQL/TiDB (needs migration to Supabase PostgreSQL)

**API Endpoints (via tRPC routers):**

**CV Management:**
- `cv.getProfile` - Retrieve user profile
- `cv.upsertProfile` - Create/update profile
- `cv.getExperiences` - Get work experiences
- `cv.createExperience` / `updateExperience` / `deleteExperience`
- `cv.getEducation` - Get education entries
- `cv.createEducation` / `updateEducation` / `deleteEducation`
- `cv.getSkills` - Get skills
- `cv.createSkill` / `updateSkill` / `deleteSkill`
- `cv.getTemplates` - Get CV templates
- `cv.createTemplate` / `updateTemplate` / `deleteTemplate`
- `cv.exportJson` - Export CV as JSON
- `cv.importJson` - Import CV from JSON

**Portfolio Management:**
- `portfolio.getProjectsByUser` - Get user's projects
- `portfolio.createProject` / `updateProject` / `deleteProject`
- `portfolio.getBlogPostsByUser` - Get user's blog posts
- `portfolio.createBlogPost` / `updateBlogPost` / `deleteBlogPost`
- `portfolio.getSettings` / `updateSettings`

### Database Schema

**Tables Required:**

1. **users** - User authentication and profiles
   - id (primary key)
   - email, name
   - role (admin/user)
   - OAuth provider data
   - timestamps

2. **cv_profiles** - Personal CV information
   - id (primary key)
   - user_id (foreign key)
   - full_name, title, email, phone, location
   - date_of_birth, nationality, profile_photo
   - profile_summary
   - core_strengths (JSONB)
   - languages (JSONB)
   - timestamps

3. **cv_experiences** - Work experience entries
   - id (primary key)
   - user_id (foreign key)
   - job_title, company, location
   - start_date, end_date, is_current
   - overview
   - role_categories (JSONB)
   - description
   - order (for sorting)
   - timestamps

4. **cv_education** - Education entries
   - id (primary key)
   - user_id (foreign key)
   - school, degree, field, location
   - start_date, end_date, is_ongoing
   - overview
   - education_sections (JSONB)
   - website, eqf_level
   - description
   - order (for sorting)
   - timestamps

5. **cv_skills** - Skills and competencies
   - id (primary key)
   - user_id (foreign key)
   - skill_name, category, proficiency
   - order (for sorting)
   - timestamps

6. **cv_templates** - Saved CV configurations
   - id (primary key)
   - user_id (foreign key)
   - name, description
   - selected_experience_ids (JSONB)
   - selected_education_ids (JSONB)
   - selected_skill_ids (JSONB)
   - include_profile, include_languages
   - is_default
   - timestamps

7. **portfolio_projects** - Project showcase entries
   - id (primary key)
   - user_id (foreign key)
   - title, description
   - image_url, tags (JSONB), link
   - order, is_published
   - timestamps

8. **blog_posts** - Blog content
   - id (primary key)
   - user_id (foreign key)
   - title, slug, content, excerpt
   - image_url, tags (JSONB)
   - is_published, published_at
   - timestamps

9. **portfolio_settings** - Portfolio customization
   - id (primary key)
   - user_id (foreign key)
   - portfolio_title, portfolio_description
   - portfolio_image
   - social_links (JSONB)
   - timestamps

### Utilities and Features

**PDF Generation:** `pdfGenerator.ts`
- Uses jsPDF and html2canvas
- Creates professional, ATS-friendly CVs
- Handles page breaks automatically
- Traditional CV design with proper typography

**AI-Friendly Export:** `cvAiExport.ts`
- Generates structured JSON with AI modification guidelines
- Includes validation for AI-modified exports
- Preserves data integrity while allowing content changes

**JSON Import/Export:**
- Full CV data export for backup
- Import functionality with data merging
- Structured format for portability

---

## Integration Challenges & Solutions

### Challenge 1: Database Migration (MySQL → PostgreSQL)

**Issues:**
- Different SQL dialects
- MySQL uses `int` for booleans (0/1), PostgreSQL uses `boolean`
- Different auto-increment mechanisms
- JSON handling differences (MySQL JSON → PostgreSQL JSONB)
- Drizzle schema needs adaptation for PostgreSQL

**Solutions:**
1. Rewrite schema for PostgreSQL using Supabase best practices
2. Convert integer booleans to proper boolean types
3. Use JSONB for JSON columns (better performance)
4. Implement proper UUID instead of auto-increment integers
5. Apply Row Level Security (RLS) policies for data protection
6. Use Supabase migrations tool

### Challenge 2: Authentication Migration (Manus OAuth → Supabase Auth)

**Issues:**
- Current implementation uses custom OAuth provider (Manus)
- Authentication context and hooks tied to Manus
- User management and session handling different
- Role-based access control needs adaptation

**Solutions:**
1. Replace Manus OAuth with Supabase Auth (email/password)
2. Implement Supabase Auth hooks and context
3. Migrate user roles to Supabase user metadata
4. Update protected routes to use Supabase session
5. Implement proper RLS policies based on auth.uid()
6. Add optional OAuth providers (Google, GitHub) if needed

### Challenge 3: API Layer (tRPC → Supabase Client/Edge Functions)

**Issues:**
- Current backend uses tRPC procedures
- Needs migration to either:
  - Direct Supabase client calls (recommended for CRUD)
  - Supabase Edge Functions (for complex logic)
- Context and middleware handling different

**Solutions:**
1. **For simple CRUD operations:** Replace tRPC calls with direct Supabase client queries
2. **For complex business logic:** Create Supabase Edge Functions
3. Maintain type safety with Supabase generated types
4. Implement proper error handling
5. Use React Query for data fetching and caching
6. Add optimistic updates for better UX

### Challenge 4: File Structure & Dependencies

**Issues:**
- Missing package.json and build configuration
- No Vite config visible
- UI components assume shadcn/ui but not verified
- PDF generation dependencies (jsPDF, html2canvas) need verification

**Solutions:**
1. Create comprehensive package.json with all dependencies
2. Set up Vite configuration for Bolt.New environment
3. Install and configure necessary UI component libraries
4. Verify and install PDF generation libraries
5. Set up proper TypeScript configuration
6. Configure environment variables for Supabase

### Challenge 5: Environment Configuration

**Issues:**
- Current `.env` has Supabase credentials but incomplete
- Missing Vite environment variable prefix
- No clear separation of client/server env vars

**Solutions:**
1. Prefix all client-side variables with `VITE_`
2. Set up Supabase URL and anon key properly
3. Remove any server-side credentials from client
4. Document all required environment variables
5. Use Supabase project settings for configuration

---

## Integration Implementation Plan

### Phase 1: Project Foundation & Setup

**Objective:** Set up the Bolt.New project structure with proper configuration

**Tasks:**
1. Create `package.json` with all required dependencies:
   - React 18+, TypeScript
   - @supabase/supabase-js (Supabase client)
   - Vite, wouter (routing)
   - @tanstack/react-query (data fetching)
   - shadcn/ui components
   - jsPDF, html2canvas (PDF generation)
   - Tailwind CSS
   - lucide-react (icons)

2. Create `vite.config.ts` with proper settings

3. Create `tsconfig.json` for TypeScript

4. Create `tailwind.config.js` for styling

5. Set up proper `.env` file with Supabase credentials

6. Create `src/` directory structure:
   ```
   src/
   ├── components/        # Reusable UI components
   ├── pages/            # Page components
   ├── lib/              # Utilities and clients
   ├── hooks/            # Custom React hooks
   ├── types/            # TypeScript types
   └── App.tsx           # Main app component
   ```

**Success Criteria:**
- Project builds without errors
- Development server runs
- TypeScript compilation works
- Tailwind CSS applies correctly

---

### Phase 2: Database Schema & Supabase Setup

**Objective:** Create and deploy database schema with proper RLS policies

**Tasks:**

1. **Create Supabase Migration Files**

   **Migration 1:** `create_users_and_auth_tables.sql`
   ```sql
   -- Users table (extends Supabase auth.users)
   -- RLS policies for user data
   ```

   **Migration 2:** `create_cv_tables.sql`
   ```sql
   -- cv_profiles, cv_experiences, cv_education, cv_skills, cv_templates
   -- All with proper foreign keys and indexes
   -- RLS policies for user-owned data
   ```

   **Migration 3:** `create_portfolio_tables.sql`
   ```sql
   -- portfolio_projects, blog_posts, portfolio_settings
   -- RLS policies for content management
   ```

2. **Apply RLS Policies:**
   - Enable RLS on all tables
   - Users can only access their own data
   - Public read access for published projects/blog posts
   - Admin role checks for admin panel

3. **Create Database Functions (if needed):**
   - Helper functions for complex queries
   - Triggers for updated_at timestamps

4. **Generate TypeScript Types:**
   - Use Supabase CLI to generate types
   - Import types into project

**Success Criteria:**
- All tables created successfully
- RLS policies enforce data access rules
- TypeScript types generated and importable
- Test queries work from Supabase dashboard

---

### Phase 3: Authentication Implementation

**Objective:** Replace Manus OAuth with Supabase Auth

**Tasks:**

1. **Create Supabase Client:**
   - `src/lib/supabase.ts` - Initialize Supabase client
   - Configure with environment variables

2. **Create Auth Context:**
   - `src/contexts/AuthContext.tsx`
   - Provide user state, loading state, auth methods
   - Handle session management
   - Subscribe to auth state changes

3. **Create Auth Hooks:**
   - `src/hooks/useAuth.ts` - Access auth context
   - `src/hooks/useUser.ts` - Get current user
   - `src/hooks/useSession.ts` - Get session info

4. **Create Auth Components:**
   - Login page/modal
   - Signup page/modal
   - Password reset flow
   - Protected route wrapper

5. **Update Existing Components:**
   - Replace `useAuth` imports
   - Update login/logout handlers
   - Fix protected route checks

6. **Implement Role-Based Access:**
   - Store user role in user metadata
   - Create admin check utility
   - Protect admin routes and components

**Success Criteria:**
- Users can sign up with email/password
- Users can log in and out
- Session persists across page refreshes
- Protected routes redirect correctly
- Admin panel only accessible to admins

---

### Phase 4: Data Layer Migration (CV Management)

**Objective:** Replace tRPC procedures with Supabase queries for CV data

**Tasks:**

1. **Create Data Hooks for CV Profile:**
   - `src/hooks/cv/useProfile.ts`
   - Get profile: `useQuery` with Supabase select
   - Upsert profile: `useMutation` with Supabase upsert
   - Optimistic updates for better UX

2. **Create Data Hooks for CV Experiences:**
   - `src/hooks/cv/useExperiences.ts`
   - CRUD operations with Supabase
   - Order management
   - Optimistic updates

3. **Create Data Hooks for CV Education:**
   - `src/hooks/cv/useEducation.ts`
   - Similar to experiences

4. **Create Data Hooks for CV Skills:**
   - `src/hooks/cv/useSkills.ts`
   - Grouped by category queries

5. **Create Data Hooks for CV Templates:**
   - `src/hooks/cv/useTemplates.ts`
   - Template CRUD with JSON selections

6. **Update CV Components:**
   - `CVProfileForm.tsx` - Use new hooks
   - `CVExperienceList.tsx` - Use new hooks
   - `CVEducationList.tsx` - Use new hooks
   - `CVSkillsList.tsx` - Use new hooks
   - `CVTemplatesList.tsx` - Use new hooks
   - `CVPreview.tsx` - Use new data structure

**Success Criteria:**
- All CV CRUD operations work
- Data persists correctly in Supabase
- Real-time updates work
- Optimistic UI updates feel instant
- Error handling is robust

---

### Phase 5: Data Layer Migration (Portfolio Management)

**Objective:** Migrate portfolio and blog data operations to Supabase

**Tasks:**

1. **Create Data Hooks for Projects:**
   - `src/hooks/portfolio/useProjects.ts`
   - Get user projects (private)
   - Get published projects (public)
   - CRUD operations
   - Order management

2. **Create Data Hooks for Blog Posts:**
   - `src/hooks/portfolio/useBlogPosts.ts`
   - Get user posts (private)
   - Get published posts (public)
   - CRUD operations
   - Slug uniqueness check

3. **Create Data Hooks for Portfolio Settings:**
   - `src/hooks/portfolio/useSettings.ts`
   - Get/update settings
   - Default values handling

4. **Update Admin Panel Components:**
   - Replace tRPC calls with new hooks
   - Add loading and error states
   - Implement optimistic updates

5. **Update Home Page:**
   - Fetch published projects
   - Fetch published blog posts
   - Use portfolio settings for customization

**Success Criteria:**
- Admin can manage projects
- Admin can manage blog posts
- Published content shows on homepage
- Portfolio settings apply correctly
- Public and private views work correctly

---

### Phase 6: Import/Export Functionality

**Objective:** Maintain JSON import/export and PDF generation

**Tasks:**

1. **Update JSON Export:**
   - Fetch all user CV data from Supabase
   - Generate JSON in existing format
   - Handle JSONB columns properly
   - Add download functionality

2. **Update JSON Import:**
   - Parse uploaded JSON file
   - Validate structure
   - Upsert data to Supabase
   - Handle conflicts and merging
   - Show import results

3. **Update PDF Generation:**
   - Ensure `pdfGenerator.ts` works with new data structure
   - Test with various CV lengths
   - Verify page breaks work correctly
   - Test download functionality

4. **Update AI Export Utility:**
   - Ensure `cvAiExport.ts` works with Supabase data
   - Update types if needed
   - Test validation

**Success Criteria:**
- JSON export downloads correctly
- JSON import works with validation
- PDF export generates professional CVs
- Page breaks work properly
- AI export format validated

---

### Phase 7: UI/UX Polish & Responsive Design

**Objective:** Ensure all components are polished and responsive

**Tasks:**

1. **Review All Pages:**
   - Home page responsiveness
   - CV Manager on mobile/tablet
   - Admin Panel on various screens

2. **Improve Loading States:**
   - Add skeleton loaders
   - Improve spinner UX
   - Add progress indicators

3. **Improve Error Handling:**
   - User-friendly error messages
   - Retry mechanisms
   - Toast notifications

4. **Add Transitions:**
   - Page transitions
   - Component animations
   - Hover effects

5. **Accessibility:**
   - Keyboard navigation
   - ARIA labels
   - Focus management
   - Color contrast

**Success Criteria:**
- App works on mobile, tablet, desktop
- Loading states are clear
- Errors are user-friendly
- Animations are smooth
- Accessibility score is high

---

### Phase 8: Testing & Quality Assurance

**Objective:** Test all functionality thoroughly

**Tasks:**

1. **Functional Testing:**
   - User registration and login
   - CV profile creation and editing
   - Experience/education/skills CRUD
   - Template creation and management
   - JSON import/export
   - PDF generation
   - Portfolio content management
   - Admin panel access control

2. **Data Integrity Testing:**
   - RLS policies work correctly
   - Users can't access other users' data
   - Admin role checks work
   - Data validation works

3. **Performance Testing:**
   - Page load times
   - Query performance
   - Large CV handling
   - Multiple templates

4. **Cross-Browser Testing:**
   - Chrome, Firefox, Safari, Edge
   - Mobile browsers

**Success Criteria:**
- All features work as expected
- No data leaks between users
- Performance is acceptable
- Works across browsers

---

### Phase 9: Documentation & Deployment

**Objective:** Document the project and prepare for use

**Tasks:**

1. **Update Documentation:**
   - Update `DOCUMENTATION.md` for Supabase
   - Update `QUICKSTART.md` with new setup
   - Add Supabase-specific guides
   - Document environment variables
   - Document RLS policies

2. **Code Documentation:**
   - Add JSDoc comments to functions
   - Document complex logic
   - Add inline comments where needed

3. **Create User Guide:**
   - How to use CV Manager
   - How to use Admin Panel
   - How to export/import CVs
   - How to generate PDFs

4. **Deployment Checklist:**
   - Environment variables set
   - Supabase migrations applied
   - RLS policies enabled
   - Build process works
   - Production URLs configured

**Success Criteria:**
- Documentation is comprehensive
- New users can understand the system
- Deployment is straightforward
- All guides are up-to-date

---

## Technical Decisions & Rationale

### Decision 1: Direct Supabase Client vs Edge Functions

**Decision:** Use direct Supabase client calls for most operations, Edge Functions only for complex logic

**Rationale:**
- Simpler architecture for CRUD operations
- Better type safety with generated types
- Faster development
- Lower latency (no extra hop)
- Edge Functions for:
  - Complex business logic
  - External API integrations
  - Scheduled jobs
  - Webhooks

### Decision 2: Authentication Method

**Decision:** Use Supabase Auth with email/password, add OAuth later if needed

**Rationale:**
- Simplest to implement
- Built into Supabase
- Good security practices
- Can add OAuth providers later
- Fits Bolt.New environment

### Decision 3: State Management

**Decision:** Use React Query (@tanstack/react-query) for server state, React Context for auth

**Rationale:**
- React Query excellent for data fetching
- Built-in caching and revalidation
- Optimistic updates support
- Less boilerplate than Redux
- Works well with Supabase

### Decision 4: Database IDs

**Decision:** Use UUIDs instead of auto-increment integers

**Rationale:**
- PostgreSQL best practice
- Better for distributed systems
- No sequential ID leakage
- Supabase recommendation
- Easier to merge data

### Decision 5: JSON Storage

**Decision:** Use JSONB for arrays and objects

**Rationale:**
- Better query performance than JSON
- Indexable in PostgreSQL
- Flexible schema
- Good for: languages, tags, role_categories, etc.

---

## Data Migration Strategy

### For Existing Data (if applicable)

If there is existing data in MySQL/TiDB:

1. **Export Data:**
   - Export all tables to JSON
   - Transform to match new schema
   - Convert integer booleans to true/false
   - Convert IDs to UUIDs

2. **Transform Data:**
   - Map old user IDs to new UUIDs
   - Parse JSON strings to objects
   - Validate all required fields
   - Set proper defaults

3. **Import to Supabase:**
   - Create users first (with authentication)
   - Import CV data with user references
   - Import portfolio data
   - Verify all relationships

### For New Installation

- Start fresh with clean Supabase database
- Test with sample data
- User creates account and starts fresh

---

## Risk Assessment & Mitigation

### Risk 1: Data Loss During Migration

**Severity:** High
**Likelihood:** Low
**Mitigation:**
- Backup all data before migration
- Test migration on staging environment
- Validate all data after import
- Keep old database accessible for rollback

### Risk 2: Authentication Issues

**Severity:** High
**Likelihood:** Medium
**Mitigation:**
- Implement auth early
- Test thoroughly
- Have fallback login method
- Document auth flow clearly

### Risk 3: PDF Generation Performance

**Severity:** Medium
**Likelihood:** Low
**Mitigation:**
- Test with large CVs
- Optimize HTML generation
- Consider server-side rendering if needed
- Add loading indicators

### Risk 4: RLS Policy Errors

**Severity:** High
**Likelihood:** Medium
**Mitigation:**
- Test all RLS policies thoroughly
- Use Supabase policy testing tools
- Have fallback to service role for debugging
- Document all policies clearly

### Risk 5: Missing Dependencies

**Severity:** Low
**Likelihood:** Medium
**Mitigation:**
- Create comprehensive package.json
- Test build process early
- Document all required libraries
- Use exact versions for stability

---

## Success Metrics

1. **Functionality:**
   - 100% of existing features work in Supabase
   - No data loss during migration
   - All tests pass

2. **Performance:**
   - Page load < 2 seconds
   - Query response < 500ms
   - PDF generation < 5 seconds

3. **Security:**
   - All RLS policies enforce correctly
   - No unauthorized data access
   - Authentication works reliably

4. **User Experience:**
   - Intuitive navigation
   - Clear error messages
   - Responsive on all devices
   - Smooth interactions

5. **Code Quality:**
   - TypeScript strict mode enabled
   - No console errors in production
   - Comprehensive documentation
   - Clean code structure

---

## Timeline Estimate

**Total Estimated Time:** 15-20 hours

- **Phase 1:** Project Setup - 2 hours
- **Phase 2:** Database Schema - 3 hours
- **Phase 3:** Authentication - 3 hours
- **Phase 4:** CV Data Layer - 3 hours
- **Phase 5:** Portfolio Data Layer - 2 hours
- **Phase 6:** Import/Export - 2 hours
- **Phase 7:** UI/UX Polish - 2 hours
- **Phase 8:** Testing - 2 hours
- **Phase 9:** Documentation - 1 hour

---

## Post-Integration Enhancements (Future)

1. **Real-time Collaboration:**
   - Use Supabase Realtime for live updates
   - Multiple users can view CV being edited

2. **AI Integration:**
   - AI-powered CV content suggestions
   - Job description matching
   - Skill recommendations

3. **Advanced Templates:**
   - Multiple PDF template styles
   - Custom branding options
   - Color themes

4. **Analytics:**
   - Track CV downloads
   - View statistics
   - Popular skills tracking

5. **Social Features:**
   - Share CVs with links
   - Public portfolio pages
   - CV comparison tools

6. **Additional Export Formats:**
   - Word document export
   - LinkedIn profile sync
   - HTML resume export

---

## Conclusion

This integration plan provides a comprehensive roadmap for migrating the Portfolio & CV Manager application to the Bolt.New environment with Supabase. The phased approach ensures systematic implementation while maintaining data integrity and feature parity.

The key challenges involve database migration, authentication replacement, and API layer transformation. By following this plan and implementing proper testing at each phase, the integration should result in a robust, scalable application that leverages Supabase's powerful features while maintaining the excellent user experience of the original application.

The plan prioritizes data safety, user security, and feature completeness while providing a clear path forward for future enhancements.

---

**Document Version:** 1.2
**Last Updated:** November 3, 2025
**Status:** Phase 3 Complete - Authentication Fully Implemented
**Next Phase:** Phase 4 - Data Layer Migration (CV Management)
