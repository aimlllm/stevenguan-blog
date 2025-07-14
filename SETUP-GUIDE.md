# Blog Platform Setup Guide

🎉 **Congratulations!** Your technical blog platform has been successfully implemented. Follow this guide to complete the setup and start using your blog.

## ✅ What's Already Done

- ✅ Next.js 14 blog platform with dark mode
- ✅ MDX content system with sample posts
- ✅ Tailwind CSS styling and responsive design
- ✅ Supabase integration for database
- ✅ Authentication system with social providers
- ✅ Comment system with community guidelines
- ✅ Like/dislike reactions for posts
- ✅ Docker development environment
- ✅ Professional UI/UX design

## 🚀 Quick Start - Bring Up Your Website

### Step 1: Complete Environment Setup

1. **Generate NextAuth Secret**:
   ```bash
   openssl rand -base64 32
   ```

2. **Update your `.env.local` file** with the generated secret:
   ```bash
   # Add this line to your .env.local file
   NEXTAUTH_SECRET=your-generated-secret-here
   ```

3. **Add Google Client Secret** to your `.env.local`:
   ```bash
   # You need to get this from Google Cloud Console
   GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
   ```

### Step 2: Set Up Supabase Database

1. **Go to your Supabase project**: https://asciyoncfkeqkkcxdrqz.supabase.co

2. **Open the SQL Editor** (left sidebar → SQL Editor)

3. **Create a new query** and copy-paste this entire database setup script:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    provider TEXT,
    provider_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    tags TEXT[],
    categories TEXT[],
    author TEXT,
    featured BOOLEAN DEFAULT FALSE,
    draft BOOLEAN DEFAULT FALSE,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_slug TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reactions table
CREATE TABLE IF NOT EXISTS reactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_slug TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('like', 'dislike')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_slug, user_id)
);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_slug TEXT NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_comments_post_slug ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_post_slug ON reactions(post_slug);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_post_slug ON analytics(post_slug);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts(draft);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view all profiles" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Create policies for posts table
CREATE POLICY "Posts are viewable by everyone" ON posts
    FOR SELECT USING (NOT draft OR auth.uid() IS NOT NULL);

CREATE POLICY "Posts can be inserted by authenticated users" ON posts
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Posts can be updated by authenticated users" ON posts
    FOR UPDATE WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for comments table
CREATE POLICY "Comments are viewable by everyone" ON comments
    FOR SELECT USING (true);

CREATE POLICY "Comments can be inserted by authenticated users" ON comments
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Comments can be updated by own user" ON comments
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Comments can be deleted by own user" ON comments
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create policies for reactions table
CREATE POLICY "Reactions are viewable by everyone" ON reactions
    FOR SELECT USING (true);

CREATE POLICY "Reactions can be inserted by authenticated users" ON reactions
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Reactions can be updated by own user" ON reactions
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Reactions can be deleted by own user" ON reactions
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create policies for analytics table
CREATE POLICY "Analytics are viewable by everyone" ON analytics
    FOR SELECT USING (true);

CREATE POLICY "Analytics can be inserted by everyone" ON analytics
    FOR INSERT WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

4. **Click "Run"** to execute the script

### Step 3: Get Google Client Secret

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Find your project** with OAuth Client ID: `928585084803-8purk82meipnp8k9k3sbfdd3ctc66du1.apps.googleusercontent.com`
3. **Go to APIs & Services** → **Credentials**
4. **Click on your OAuth 2.0 Client ID**
5. **Copy the Client Secret** and add it to your `.env.local`

### Step 4: Start Your Website

Choose one of these methods:

**Option A: Using Docker (Recommended)**
```bash
# Build and start the development container
docker-compose up --build

# Your website will be available at: http://localhost:3000
```

**Option B: Traditional Development**
```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Your website will be available at: http://localhost:3000
```

### Step 5: Test Your Setup

1. **Visit your blog**: http://localhost:3000
2. **Test authentication**: Click "Sign In" and try Google/GitHub login
3. **Test posts**: Navigate to `/blog` and click on a post
4. **Test reactions**: Try the like/dislike buttons (requires sign-in)
5. **Test comments**: Try posting a comment (requires sign-in)

## 🌐 DNS Setup with Porkbun

### Step 1: Point Your Domain to Vercel

1. **Login to Porkbun**: https://porkbun.com/account/domainsSpeedy
2. **Find your domain** (stevenguan.com)
3. **Click "DNS"** next to your domain
4. **Add these DNS records**:

   **For the main domain (stevenguan.com):**
   ```
   Type: A
   Host: @
   Answer: 76.76.19.19
   TTL: 300
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Host: www
   Answer: stevenguan.com
   TTL: 300
   ```

   **Alternative A Records (use all of these):**
   ```
   Type: A
   Host: @
   Answer: 76.76.19.19
   TTL: 300
   
   Type: A
   Host: @
   Answer: 76.223.126.88
   TTL: 300
   ```

### Step 2: Configure Domain in Vercel

1. **Deploy to Vercel first** (see deployment section below)
2. **Go to your Vercel dashboard**: https://vercel.com/dashboard
3. **Click on your project**
4. **Go to Settings** → **Domains**
5. **Add domain**: `stevenguan.com`
6. **Add domain**: `www.stevenguan.com`

### Step 3: Wait for DNS Propagation

- DNS changes can take 24-48 hours to propagate
- You can check status at: https://www.whatsmydns.net/
- Enter your domain and check if it resolves to Vercel's IP

## 🚀 Deploy to Production

### Step 1: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy your project
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? personal-blog
# - In which directory is your code located? ./
# - Want to override settings? No
```

### Step 2: Add Environment Variables to Vercel

1. **Go to your Vercel dashboard**
2. **Click on your project**
3. **Go to Settings** → **Environment Variables**
4. **Add each variable from your `.env.local`**:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to `https://stevenguan.com`)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SITE_URL` (set to `https://stevenguan.com`)
   - All other variables from your `.env.local`

### Step 3: Update OAuth Redirect URIs

**Google OAuth:**
1. Go to Google Cloud Console
2. Update redirect URIs to include: `https://stevenguan.com/api/auth/callback/google`

**GitHub OAuth:**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Update redirect URIs to include: `https://stevenguan.com/api/auth/callback/github`

### Step 4: Test Production Deployment

1. **Wait for deployment** to complete
2. **Visit your domain**: https://stevenguan.com
3. **Test all features** as before

## 📝 Adding New Blog Posts

Create new MDX files in `content/posts/`:

```bash
# Create a new post file
touch content/posts/my-new-post.mdx
```

Add frontmatter and content:
```markdown
---
title: "My New Post"
slug: "my-new-post"
description: "A brief description"
publishedAt: "2024-12-15"
tags: ["tag1", "tag2"]
categories: ["Category"]
author: "Steven"
featured: false
draft: false
---

# Your content here

This is your blog post content written in MDX.
```

Deploy:
```bash
git add .
git commit -m "Add new blog post"
git push
# Vercel will automatically deploy
```

## 🛠️ Troubleshooting

### Common Issues

1. **"Invalid next.config.js options detected"** warning:
   - This is just a warning and doesn't affect functionality
   - The app will still work correctly

2. **Authentication not working**:
   - Check that all OAuth redirect URIs are correct
   - Verify environment variables are set in both local and Vercel
   - Check browser console for errors

3. **Database errors**:
   - Ensure the Supabase setup script ran successfully
   - Check Row Level Security policies
   - Verify API keys are correct

4. **Comments not working**:
   - Make sure you're signed in
   - Check browser network tab for API errors
   - Verify database tables exist

5. **DNS not working**:
   - Wait up to 48 hours for DNS propagation
   - Check DNS records are correct in Porkbun
   - Verify domain is added in Vercel

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Docker development
docker-compose up --build
```

## 📊 Features Overview

### ✅ Current Features
- 📝 MDX blog posts with syntax highlighting
- 🌗 Dark/light mode toggle
- 🔐 Social authentication (Google, GitHub)
- 💬 Comment system with guidelines
- 👍 Post reactions (like/dislike)
- 📱 Mobile responsive design
- 🔍 Search and filtering
- 🏷️ Tags and categories
- 📊 Basic analytics ready

### 🚧 Next Steps (Optional)
- 📧 Email notifications (requires SMTP setup)
- 🔗 LinkedIn/Facebook OAuth (requires app setup)
- 📊 Advanced analytics dashboard
- 📧 Newsletter signup
- 🎨 Comment markdown rendering
- 🔍 Full-text search

## 🎯 Success Checklist

- [ ] Environment variables configured
- [ ] Database setup completed in Supabase
- [ ] Google Client Secret added
- [ ] Website running locally on http://localhost:3000
- [ ] Google OAuth working
- [ ] GitHub OAuth working  
- [ ] Can create and view blog posts
- [ ] Authentication works
- [ ] Comments work
- [ ] Reactions work
- [ ] Deployed to Vercel
- [ ] DNS configured with Porkbun
- [ ] Domain working: https://stevenguan.com

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure OAuth apps are configured correctly
4. Check the Supabase database setup
5. Verify DNS records in Porkbun

Your blog platform is ready to go! 🚀 Happy blogging! 