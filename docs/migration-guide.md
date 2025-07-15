# Migration Guide: Restructuring to Modern Architecture

## 📋 Prerequisites
- Backup your current codebase
- Node.js 18+
- Git for version control

## 🚀 Step 1: Create New Directory Structure

```bash
# Create main directories
mkdir -p shared/{components/{ui,forms,layout,media},hooks,utils,types,constants,styles}
mkdir -p frontend/{components/{navigation,comments,reactions,providers},lib}
mkdir -p backend/{api/{auth,blog,projects,comments,reactions,analytics},lib/{database,auth,validation,email},middleware,types}
mkdir -p content/{blog/{posts,images,videos},projects/assets/{images,videos},pages}
mkdir -p database/{migrations,schemas,seeds}
mkdir -p docs
```

## 🔄 Step 2: Move Existing Files

```bash
# Move documentation
mv AUTHENTICATION-FIX-SUMMARY.md docs/
mv SETUP-GUIDE.md docs/

# Move current components to shared
mv components/ui/* shared/components/ui/
mv components/blog/* shared/components/layout/
mv components/comments/* frontend/components/comments/
mv components/auth/* shared/components/forms/

# Move utilities and types
mv utils/* shared/utils/
mv types/* shared/types/
mv lib/* shared/lib/

# Move app directory to frontend
mv app/* frontend/app/
mv middleware.ts frontend/

# Move API routes to backend
mv app/api/* backend/api/

# Move content
mv content/posts/* content/blog/posts/
mv public/images/* content/blog/images/
```

## 🔧 Step 3: Update TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./"],
      "@/shared/*": ["./shared/*"],
      "@/frontend/*": ["./frontend/*"],
      "@/backend/*": ["./backend/*"],
      "@/content/*": ["./content/*"]
    }
  }
}
```

## 📦 Step 4: Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "migrate": "node scripts/migrate.js"
  }
}
```

## 🔄 Step 5: Create Migration Scripts

This will be an iterative process. Test each step before proceeding.

## 📝 Step 6: Create Content Management

Create MDX processing utilities in `shared/utils/content.ts` and set up blog post structure in `content/blog/posts/`.

## 🎯 Step 7: Update Import Paths

Update all import statements to use new paths:
- `@/shared/components/ui/Button` instead of `@/components/ui/Button`
- `@/backend/lib/database/posts` for database operations
- `@/frontend/components/navigation/Header` for frontend-specific components

## 🐳 Step 8: Docker Setup

Update Dockerfile and docker-compose.yml to work with new structure.

## 🔐 Step 9: Fix Supabase Integration

Update Supabase client configuration and ensure proper database connections.

## ✅ Step 10: Test and Deploy

1. Test local development
2. Update build configuration
3. Deploy to production
4. Monitor for issues

## 🚨 Important Notes

- Take this step by step
- Test after each major change
- Keep backups of working states
- Update one component at a time
- Don't change everything at once

## 📞 Need Help?

If you encounter issues during migration, start with the shared utilities first, then move to frontend components, and finally backend API routes. 