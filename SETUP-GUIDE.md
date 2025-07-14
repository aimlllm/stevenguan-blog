# Steven Guan's Blog Platform - Complete Setup Guide

🎉 **Welcome!** This guide will take you through the complete process of setting up and deploying Steven Guan's technical blog platform.

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Git installed
- ✅ GitHub account
- ✅ Vercel account (free tier)
- ✅ Supabase account (free tier)
- ✅ Google Cloud Console access
- ✅ GitHub Developer Settings access

## 🚀 Part 1: Local Development Setup

### Step 1: Clone Repository and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/aimlllm/stevenguan-blog.git
cd stevenguan-blog

# Install dependencies
npm install
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp env.example .env.local

# Generate NextAuth secret
openssl rand -base64 32
```

**Update your `.env.local` file:**
```bash
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-generated-secret-from-above

# Social Authentication (you'll get these in the next steps)
GOOGLE_CLIENT_ID=928585084803-8purk82meipnp8k9k3sbfdd3ctc66du1.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=Iv23liM1F88FmJSn3G9a
GITHUB_CLIENT_SECRET=0b671dd5e8a2e246877129d4bb213eed84c7a1ed

# Supabase Database (provided)
NEXT_PUBLIC_SUPABASE_URL=https://asciyoncfkeqkkcxdrqz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY2l5b25jZmtlcWtrY3hkcnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTIyMjIsImV4cCI6MjA2Nzc2ODIyMn0.YI8nIWMIu0Ls4Kqs6jjc6epKei-4cfCSWxFWLMzIX6Q
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY2l5b25jZmtlcWtrY3hkcnF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE5MjIyMiwiZXhwIjoyMDY3NzY4MjIyfQ.7cjF6YgzMH3JZZBTmyEDDLxZCZTQSDZWhOu1yGsFFsI

# Site Configuration
SITE_URL=http://localhost:3000
SITE_NAME=Steven Guan's log
AUTHOR_NAME=Steven
AUTHOR_EMAIL=steven@stevenguan.com
```

### Step 3: Test Local Development

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# You should see the blog homepage
```

## 🗄️ Part 2: Supabase Database Setup

The Supabase database is already configured, but here's an overview of the setup:

### Database Schema Overview

The database includes these main tables:
- **users** - Store authenticated user profiles
- **comments** - Blog post comments with user relationships
- **reactions** - Like/dislike reactions for posts
- **analytics** - Track page views and user interactions

### Row Level Security (RLS) Policies

**Key Security Features:**
- Users can only edit their own comments and reactions
- Public users can view non-hidden content
- Authenticated users can create comments and reactions
- Service role has admin access for user management

**Example RLS Policy:**
```sql
CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (auth.uid()::text = user_id::text);
```

The RLS ensures data security at the database level, preventing unauthorized access even if the application logic has vulnerabilities.

## 🔐 Part 3: OAuth Configuration

### Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Navigate to APIs & Services** → **Credentials**
3. **Find your OAuth 2.0 Client ID**: `928585084803-8purk82meipnp8k9k3sbfdd3ctc66du1.apps.googleusercontent.com`
4. **Copy the Client Secret** and add it to your `.env.local`
5. **Add redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://stevenguan.com/api/auth/callback/google`

### GitHub OAuth Setup

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **Click "OAuth Apps"**
3. **Find your app** with Client ID: `Iv23liM1F88FmJSn3G9a`
4. **Update redirect URIs**:
   - Development: `http://localhost:3000/api/auth/callback/github`
   - Production: `https://stevenguan.com/api/auth/callback/github`

## ⚡ Part 4: Complete Vercel Deployment Guide

### Step 1: Prepare for Deployment

**Ensure your code is committed:**
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

### Step 2: Create New Project in Vercel

1. **Visit Vercel Dashboard**: https://vercel.com/dashboard

2. **Click "Add New..." → "Project"**

3. **Import Git Repository**:
   - Click "Import" next to `aimlllm/stevenguan-blog`
   - If not visible, click "Adjust GitHub App Permissions" to grant access

4. **Configure Project Settings**:
   ```
   Project Name: stevenguan-blog
   Framework Preset: Next.js
   Root Directory: ./ (top-level)
   Build Command: npm run build
   Install Command: npm install
   Output Directory: .next (leave default)
   ```

5. **Click "Deploy"** (Don't add environment variables yet)

### Step 3: Add Environment Variables in Vercel

**After the initial deployment:**

1. **Go to Project Settings** → **Environment Variables**

2. **Add each variable for Production environment:**

   **NextAuth Configuration:**
   ```
   NEXTAUTH_URL = https://stevenguan.com
   NEXTAUTH_SECRET = your-generated-secret-here
   ```

   **Social Authentication:**
   ```
   GOOGLE_CLIENT_ID = 928585084803-8purk82meipnp8k9k3sbfdd3ctc66du1.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = your-google-client-secret
   GITHUB_CLIENT_ID = Iv23liM1F88FmJSn3G9a
   GITHUB_CLIENT_SECRET = 0b671dd5e8a2e246877129d4bb213eed84c7a1ed
   ```

   **Supabase Database:**
   ```
   NEXT_PUBLIC_SUPABASE_URL = https://asciyoncfkeqkkcxdrqz.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY2l5b25jZmtlcWtrY3hkcnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxOTIyMjIsImV4cCI6MjA2Nzc2ODIyMn0.YI8nIWMIu0Ls4Kqs6jjc6epKei-4cfCSWxFWLMzIX6Q
   SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzY2l5b25jZmtlcWtrY3hkcnF6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE5MjIyMiwiZXhwIjoyMDY3NzY4MjIyfQ.7cjF6YgzMH3JZZBTmyEDDLxZCZTQSDZWhOu1yGsFFsI
   ```

   **Site Configuration:**
   ```
   SITE_URL = https://stevenguan.com
   SITE_NAME = Steven Guan's log
   AUTHOR_NAME = Steven
   AUTHOR_EMAIL = steven@stevenguan.com
   ```

3. **Click "Save" for each variable**

### Step 4: Configure Custom Domain

1. **Go to Project Settings** → **Domains**

2. **Add Domain**:
   - Enter: `stevenguan.com`
   - Click "Add"

3. **Add WWW Subdomain**:
   - Enter: `www.stevenguan.com`
   - Click "Add"
   - Set to redirect to `stevenguan.com`

4. **Domain Configuration Status**:
   - Wait for DNS propagation (up to 48 hours)
   - Vercel will show domain status and SSL certificate

### Step 5: Trigger Production Deployment

**After adding environment variables:**

1. **Go to Deployments tab**
2. **Click "Redeploy"** on the latest deployment
3. **Select "Use existing Build Cache"**
4. **Click "Redeploy"**

**Monitor deployment:**
- Build logs will show any errors
- Deployment typically takes 2-3 minutes
- You'll get a production URL when complete

### Step 6: Verify Production Deployment

**Test these features:**

1. **Visit your domain**: https://stevenguan.com
2. **Test authentication**:
   - Click "Sign In"
   - Try Google and GitHub login
   - Verify user profile appears
3. **Test blog functionality**:
   - Navigate to `/blog`
   - Click on blog posts
   - Test like/dislike buttons (requires auth)
   - Test comment submission (requires auth)
4. **Test responsive design** on mobile devices

## 🌐 Part 5: DNS & Domain Configuration

### Porkbun DNS Setup (Already Configured)

Since you mentioned DNS is already configured, here's what should be set:

**DNS Records in Porkbun:**
```
Type: A
Host: @
Value: 76.76.19.19
TTL: 300

Type: A
Host: @  
Value: 76.223.126.88
TTL: 300

Type: CNAME
Host: www
Value: stevenguan.com
TTL: 300
```

**Check DNS Propagation:**
- Use https://www.whatsmydns.net/
- Enter `stevenguan.com`
- Verify it resolves to Vercel's IP addresses

## 🔧 Part 6: Vercel ↔ Supabase Integration Architecture

### API Route Structure

**Authentication Flow:**
```
User → NextAuth → OAuth Provider → NextAuth → Supabase (user sync) → Session
```

**Comment Submission Flow:**
```
User → Frontend → /api/comments → NextAuth (verify) → Supabase (RLS) → Real-time update
```

**Data Security:**
- All API routes verify authentication via NextAuth
- Supabase RLS policies provide database-level security
- Service role key used for admin operations only

### Real-time Features

**Supabase Real-time Connection:**
```typescript
// Frontend subscribes to database changes
supabase
  .channel('comments')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'comments'
  }, (payload) => {
    // Auto-refresh comments when new ones are added
  })
  .subscribe();
```

## 📝 Part 7: Content Management

### Adding New Blog Posts

1. **Create MDX file** in `content/posts/`:
   ```bash
   touch content/posts/new-post-slug.mdx
   ```

2. **Add frontmatter**:
   ```markdown
   ---
   title: "Your Post Title"
   slug: "new-post-slug"
   description: "Brief description for SEO"
   publishedAt: "2024-12-15"
   tags: ["AI", "Technology"]
   categories: ["Technical"]
   author: "Steven"
   featured: false
   draft: false
   ---

   # Your Content Here

   Write your blog post content in Markdown.
   ```

3. **Commit and deploy**:
   ```bash
   git add .
   git commit -m "Add new blog post"
   git push origin main
   # Vercel auto-deploys
   ```

### Content Features

- **Auto-categorization** based on keywords
- **Reading time calculation**
- **SEO optimization** with meta tags
- **Syntax highlighting** for code blocks
- **Responsive images** and layouts

## 🛠️ Part 8: Troubleshooting

### Common Issues and Solutions

#### **1. Build Errors in Vercel**

**Environment Variable Issues:**
```bash
# Check in Vercel dashboard that all required variables are set
# Ensure no trailing spaces or quotes in variable values
```

**TypeScript Errors:**
```bash
# Run locally to catch errors before deployment
npm run type-check
npm run build
```

#### **2. Authentication Not Working**

**Check OAuth Redirect URIs:**
- Google: Must include exact production URL
- GitHub: Must include exact production URL
- No trailing slashes in URLs

**Session Issues:**
```javascript
// Check NextAuth configuration
// Verify NEXTAUTH_URL matches exact domain
// Verify NEXTAUTH_SECRET is set
```

#### **3. Database Connection Issues**

**Supabase RLS Policies:**
```sql
-- Verify policies are enabled
SELECT * FROM pg_policies WHERE tablename = 'comments';
```

**API Key Verification:**
```bash
# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://asciyoncfkeqkkcxdrqz.supabase.co/rest/v1/users?select=*"
```

#### **4. Domain and DNS Issues**

**Check DNS Propagation:**
```bash
# Use online tools or command line
nslookup stevenguan.com
dig stevenguan.com A
```

**SSL Certificate Issues:**
- Vercel automatically provisions SSL
- May take up to 24 hours for full propagation
- Check Vercel domain settings for status

### Development Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Test production build
npm run type-check      # Check TypeScript

# Docker Development
docker-compose up --build  # Isolated environment

# Deployment
git push origin main     # Auto-deploys to Vercel
vercel --prod           # Manual deployment via CLI
```

## 🎯 Deployment Checklist

### Pre-Deployment
- [ ] Code committed to GitHub
- [ ] Environment variables configured locally
- [ ] Local build successful (`npm run build`)
- [ ] Authentication tested locally

### Vercel Setup
- [ ] Project imported from GitHub
- [ ] Environment variables added in Vercel
- [ ] Domain configured in Vercel
- [ ] Production deployment successful
- [ ] SSL certificate active

### OAuth Configuration
- [ ] Google OAuth redirect URIs updated for production
- [ ] GitHub OAuth redirect URIs updated for production
- [ ] Authentication tested on production

### Domain & DNS
- [ ] DNS records pointing to Vercel
- [ ] Domain accessible (https://stevenguan.com)
- [ ] WWW redirect working
- [ ] SSL certificate valid

### Feature Testing
- [ ] Blog posts loading correctly
- [ ] Authentication working (Google & GitHub)
- [ ] Comments system functional
- [ ] Like/dislike reactions working
- [ ] Dark/light mode toggle working
- [ ] Mobile responsive design verified

## 🚀 Success!

Your blog platform is now live at **https://stevenguan.com**!

**Next Steps:**
1. **Write your first post** and publish it
2. **Share on social media** to drive traffic
3. **Monitor analytics** in Vercel dashboard
4. **Collect user feedback** and iterate

**For support:**
- GitHub Issues: https://github.com/aimlllm/stevenguan-blog/issues
- Check deployment logs in Vercel dashboard
- Monitor Supabase database performance

---

**🎉 Congratulations! Your professional blog platform is now live and ready for content creation!** 