# Project Restructuring Plan
## From Current State to Modern, Scalable Architecture

### 🎯 Goals
1. **Modular Architecture** - Clear separation of concerns
2. **Scalable Structure** - Easy to add new features and pages
3. **Code-Managed Content** - Blog posts and projects via Git commits
4. **Multimedia Support** - Images, YouTube videos, rich media
5. **Enhanced Developer Experience** - Clear boundaries and shared utilities
6. **Production-Ready** - Optimized Supabase integration

### 📁 New Project Structure

```
personal_web/
├── README.md
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
├── docker-compose.yml
├── Dockerfile
├── .gitignore
├── .env.example
├── .env.local
│
├── docs/                              # 📚 All documentation
│   ├── API.md                        # API documentation
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── DEVELOPMENT.md                # Development setup
│   ├── AUTHENTICATION-FIX-SUMMARY.md # Current auth docs
│   └── SETUP-GUIDE.md                # Current setup guide
│
├── shared/                           # 🔄 Shared utilities and components
│   ├── components/                   # Reusable UI components
│   │   ├── ui/                      # Base UI components (Button, Input, etc.)
│   │   ├── forms/                   # Form components
│   │   ├── layout/                  # Layout components
│   │   └── media/                   # Media components (Image, Video, etc.)
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   ├── types/                       # TypeScript type definitions
│   ├── constants/                   # Application constants
│   └── styles/                      # Shared styles and themes
│
├── frontend/                         # 🎨 Next.js Frontend Application
│   ├── app/                         # Next.js 14 App Router
│   │   ├── globals.css
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Landing page (blog posts)
│   │   ├── loading.tsx              # Global loading component
│   │   ├── error.tsx                # Global error boundary
│   │   │
│   │   ├── blog/                    # Blog functionality
│   │   │   ├── page.tsx             # Blog listing page
│   │   │   ├── [slug]/              # Individual blog post
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── components/          # Blog-specific components
│   │   │       ├── BlogCard.tsx
│   │   │       ├── BlogPost.tsx
│   │   │       ├── BlogGrid.tsx
│   │   │       └── BlogSearch.tsx
│   │   │
│   │   ├── projects/                # Projects showcase
│   │   │   ├── page.tsx             # Projects listing
│   │   │   ├── [id]/                # Individual project (id = slug)
│   │   │   │   ├── page.tsx
│   │   │   │   └── loading.tsx
│   │   │   └── components/          # Project-specific components
│   │   │       ├── ProjectCard.tsx
│   │   │       ├── ProjectDetail.tsx
│   │   │       └── ProjectDemo.tsx
│   │   │
│   │   ├── about/                   # About page
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── AboutMe.tsx
│   │   │       ├── SocialLinks.tsx
│   │   │       └── ContactInfo.tsx
│   │   │
│   │   └── auth/                    # Authentication pages
│   │       ├── signin/
│   │       │   └── page.tsx
│   │       └── error/
│   │           └── page.tsx
│   │
│   ├── components/                  # Frontend-specific components
│   │   ├── navigation/              # Navigation components
│   │   ├── comments/                # Comment system
│   │   ├── reactions/               # Like/dislike reactions
│   │   └── providers/               # Context providers
│   │
│   ├── lib/                         # Frontend utilities
│   │   ├── auth.ts                  # NextAuth configuration
│   │   ├── supabase.ts              # Supabase client
│   │   ├── content.ts               # Content processing
│   │   └── utils.ts                 # Frontend utilities
│   │
│   └── middleware.ts                # Next.js middleware
│
├── backend/                          # 🔧 Backend API Layer
│   ├── api/                         # API route handlers
│   │   ├── auth/                    # Authentication endpoints
│   │   ├── blog/                    # Blog-related endpoints
│   │   ├── projects/                # Project-related endpoints
│   │   ├── comments/                # Comment system endpoints
│   │   ├── reactions/               # Reaction endpoints
│   │   └── analytics/               # Analytics endpoints
│   │
│   ├── lib/                         # Backend utilities
│   │   ├── database/                # Database operations
│   │   ├── auth/                    # Authentication utilities
│   │   ├── validation/              # Request validation
│   │   └── email/                   # Email service
│   │
│   ├── middleware/                  # API middleware
│   │   ├── auth.ts                  # Auth middleware
│   │   ├── validation.ts            # Request validation
│   │   └── rateLimit.ts             # Rate limiting
│   │
│   └── types/                       # Backend-specific types
│       ├── api.ts                   # API response types
│       ├── database.ts              # Database types
│       └── auth.ts                  # Auth types
│
├── content/                          # 📝 Content Management
│   ├── blog/                        # Blog posts
│   │   ├── posts/                   # Individual blog posts
│   │   │   ├── 2024-01-15-next-js-guide.mdx
│   │   │   ├── 2024-02-20-typescript-tips.mdx
│   │   │   └── 2024-03-10-supabase-integration.mdx
│   │   ├── images/                  # Blog post images
│   │   └── videos/                  # Blog post videos
│   │
│   ├── projects/                    # Project content
│   │   ├── personal-blog.mdx        # Project: personal-blog
│   │   ├── ai-chatbot.mdx           # Project: ai-chatbot
│   │   ├── web-scraper.mdx          # Project: web-scraper
│   │   └── assets/                  # Project assets
│   │       ├── images/
│   │       └── videos/
│   │
│   └── pages/                       # Static page content
│       ├── about.mdx
│       └── privacy.mdx
│
├── database/                         # 🗄️ Database Layer
│   ├── migrations/                  # Database migrations
│   ├── schemas/                     # Database schemas
│   ├── seeds/                       # Seed data
│   └── setup.sql                    # Database setup script
│
└── public/                          # 🌐 Static assets
    ├── images/
    ├── icons/
    └── videos/
```

### 🚀 Implementation Strategy

#### Phase 1: Foundation Setup (Week 1)
1. **Create new directory structure**
2. **Move existing files** to appropriate locations
3. **Set up shared utilities** and components
4. **Configure TypeScript paths** for new structure

#### Phase 2: Content Management (Week 2)
1. **Implement MDX blog post system**
2. **Create project content structure**
3. **Add multimedia support** (images, YouTube)
4. **Set up content processing pipeline**

#### Phase 3: Feature Enhancement (Week 3)
1. **Create projects page** with individual routing
2. **Enhance about page** with social links
3. **Improve navigation** between pages
4. **Add search and filtering**

#### Phase 4: Backend Optimization (Week 4)
1. **Optimize Supabase integration**
2. **Implement proper error handling**
3. **Add API documentation**
4. **Set up Docker containerization**

### 📝 Content Management System

#### Blog Posts (`content/blog/posts/`)
```markdown
---
title: "Understanding Next.js 14 App Router"
slug: "understanding-nextjs-14-app-router"
description: "Deep dive into the new App Router in Next.js 14"
publishedAt: "2024-01-15"
updatedAt: "2024-01-16"
author: "Steven Guan"
tags: ["nextjs", "react", "web-development"]
categories: ["Technical", "Tutorial"]
featured: true
draft: false
coverImage: "/blog/images/nextjs-14-cover.jpg"
---

# Understanding Next.js 14 App Router

Your content here with **markdown** support.

## Code Examples

```typescript
// Your code here
```

## Embedded Media

![Description](./images/diagram.png)

<YouTubeEmbed videoId="dQw4w9WgXcQ" />
```

#### Project Content (`content/projects/`)
```markdown
---
title: "Personal Blog Platform"
slug: "personal-blog-platform"
description: "A modern blog platform built with Next.js and Supabase"
startDate: "2024-01-01"
endDate: "2024-03-01"
status: "completed"
technologies: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"]
featured: true
githubUrl: "https://github.com/yourusername/personal-blog"
demoUrl: "https://stevenguan.com"
coverImage: "/projects/images/blog-platform.jpg"
---

# Personal Blog Platform

## Overview
Description of your project...

## Features
- Feature 1
- Feature 2

## Demo
<ProjectDemo url="https://stevenguan.com" />

## Code
```typescript
// Key code snippets
```
```

### 🎬 Multimedia Support

#### Image Optimization
```typescript
// shared/components/media/OptimizedImage.tsx
import Image from 'next/image'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
}

export function OptimizedImage({ src, alt, width, height, className }: OptimizedImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={className}
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/..."
    />
  )
}
```

#### YouTube Integration
```typescript
// shared/components/media/YouTubeEmbed.tsx
interface YouTubeEmbedProps {
  videoId: string
  title?: string
  className?: string
}

export function YouTubeEmbed({ videoId, title, className }: YouTubeEmbedProps) {
  return (
    <div className={`aspect-video ${className}`}>
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || 'YouTube video'}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
```

### 🔧 Enhanced Backend API Structure

#### Organized API Routes
```typescript
// backend/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPostBySlug } from '@/backend/lib/database/posts'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await getPostBySlug(params.slug)
    return NextResponse.json(post)
  } catch (error) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
}
```

#### Database Layer
```typescript
// backend/lib/database/posts.ts
import { supabaseAdmin } from '@/shared/lib/supabase'
import { Post } from '@/shared/types'

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}
```

### 🐳 Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.local
    volumes:
      - ./content:/app/content
      - ./public:/app/public
```

### 🔐 Enhanced Supabase Integration

#### Row Level Security Policies
```sql
-- Enhanced RLS for posts table
CREATE POLICY "Anyone can read published posts" ON posts
  FOR SELECT USING (published = true);

CREATE POLICY "Authors can manage their posts" ON posts
  FOR ALL USING (auth.uid()::text = author_id::text);

-- Comments with proper user relationship
CREATE POLICY "Anyone can read comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid()::text = user_id::text);
```

### 🎯 Navigation and Routing

#### Dynamic Project Routes
```typescript
// frontend/app/projects/[id]/page.tsx
import { getProjectById } from '@/backend/lib/database/projects'
import { ProjectDetail } from '@/frontend/components/projects/ProjectDetail'

export async function generateStaticParams() {
  const projects = await getAllProjects()
  return projects.map((project) => ({
    id: project.slug,
  }))
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id)
  
  if (!project) {
    return <div>Project not found</div>
  }

  return <ProjectDetail project={project} />
}
```

### 📊 Benefits of This Structure

1. **Clear Separation of Concerns** - Frontend, backend, content, and shared utilities
2. **Scalable Architecture** - Easy to add new features and pages
3. **Modern Development Experience** - TypeScript, hot reloading, organized imports
4. **Production Ready** - Optimized builds, proper error handling, security
5. **Content Management** - Git-based workflow for blog posts and projects
6. **Multimedia Support** - Images, videos, and rich media integration
7. **SEO Optimized** - Static generation, proper meta tags, structured data

### 🔄 Migration Steps

1. **Backup current codebase**
2. **Create new directory structure**
3. **Move files incrementally** (start with shared utilities)
4. **Update import paths** and dependencies
5. **Test each component** as you migrate
6. **Deploy incrementally** to avoid breaking changes

This structure provides a solid foundation for your personal website that can grow with your needs while maintaining clean boundaries and excellent developer experience. 