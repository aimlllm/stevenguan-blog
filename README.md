# Technical Blog Platform

A modern, minimalist technical blog platform built with Next.js 14, TypeScript, and Tailwind CSS. Features include MDX content support, dark mode, social authentication, real-time comments, and analytics.

## Features

- **📝 MDX Content**: Write blog posts in Markdown with React components
- **🌗 Dark Mode**: Built-in dark/light theme switching
- **🔐 Social Authentication**: Login with Google, GitHub, LinkedIn, and Facebook
- **💬 Real-time Comments**: Interactive comment system with moderation
- **👍 Post Reactions**: Like/dislike system for posts
- **📊 Analytics**: Built-in analytics and traffic tracking
- **🔍 Search & Filter**: Search posts by title, content, tags, and categories
- **📱 Mobile Responsive**: Optimized for all device sizes
- **⚡ Fast Performance**: Static site generation with dynamic features
- **🔒 Security**: Built-in security headers and protection

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, next-themes
- **Content**: MDX, gray-matter, rehype/remark plugins
- **Authentication**: NextAuth.js v5
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **Analytics**: Vercel Analytics, Supabase Analytics

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd personal-blog
npm install
```

### 2. Environment Setup

Copy the environment template:

```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Social Authentication
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
ADMIN_EMAIL=your-admin-email@gmail.com
FROM_EMAIL=noreply@yourdomain.com

# Site Configuration
SITE_NAME=Your Technical Blog
SITE_URL=https://yourdomain.com
SITE_DESCRIPTION=AI industry insights and technical learning
AUTHOR_NAME=Your Name
AUTHOR_EMAIL=your-email@gmail.com
```

### 3. Development with Docker (Recommended)

For safe development without affecting your Mac system:

```bash
# Build and start the development container
docker-compose up --build

# Access the application
open http://localhost:3000
```

### 4. Traditional Development

```bash
npm run dev
```

## Configuration Required

### 1. Social Authentication Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

#### LinkedIn OAuth
1. Go to [LinkedIn Developer Portal](https://www.linkedin.com/developers/)
2. Create a new app
3. Add redirect URLs: `http://localhost:3000/api/auth/callback/linkedin`

#### Facebook OAuth
1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Set redirect URI: `http://localhost:3000/api/auth/callback/facebook`

### 2. Supabase Database Setup

1. Create a [Supabase](https://supabase.com/) account
2. Create a new project
3. Run the following SQL in the SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  avatar_url TEXT,
  provider VARCHAR(50),
  provider_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  is_hidden BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post reactions table
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) CHECK (reaction_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_slug, user_id)
);

-- Analytics table
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_slug VARCHAR(255),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_hash VARCHAR(64),
  user_agent_hash VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust as needed)
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (NOT is_hidden);
CREATE POLICY "Authenticated users can create comments" ON comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Reactions are viewable by everyone" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage reactions" ON post_reactions FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Page views are insertable by everyone" ON page_views FOR INSERT WITH CHECK (true);
```

4. Get your project URL and API keys from Settings > API

### 3. Email Configuration

For Gmail SMTP:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in `SMTP_PASSWORD`

## Writing Blog Posts

### 1. Create a new MDX file

Create a new file in `content/posts/`:

```bash
content/posts/my-new-post.mdx
```

### 2. Add frontmatter

```markdown
---
title: "My New Post"
slug: "my-new-post"
description: "A brief description of the post"
publishedAt: "2024-12-15"
tags: ["javascript", "react", "tutorial"]
categories: ["Development", "Tutorial"]
author: "Your Name"
featured: false
draft: false
readingTime: 5
---

# Your blog content here

This is where you write your blog post content in Markdown format.

## You can use headings

- Lists
- Code blocks
- And more!
```

### 3. Automatic Features

- **Auto-categorization**: Posts are automatically categorized based on keywords
- **Reading time**: Calculated automatically if not specified
- **SEO optimization**: Meta tags generated from frontmatter
- **Social sharing**: Open Graph and Twitter cards

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Custom Domain (Porkbun)

1. Add domain in Vercel dashboard
2. Update DNS records in Porkbun:
   - A Record: `@` → `76.76.19.61`
   - CNAME Record: `www` → `yourdomain.com`

## Development

### Project Structure

```
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── blog/           # Blog pages
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # UI components
│   ├── blog/          # Blog components
│   └── auth/          # Auth components
├── content/           # MDX blog posts
│   └── posts/         # Blog post files
├── lib/               # Utilities and configs
│   ├── config.ts      # Centralized config
│   ├── mdx.ts         # MDX processing
│   └── utils.ts       # Utility functions
├── types/             # TypeScript types
└── public/            # Static assets
```

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript check
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

For issues and questions:
- Create an issue in the GitHub repository
- Email: your-email@domain.com

## License

MIT License - see LICENSE file for details 