---
title: "Personal Website & Blog"
description: "A modern, full-stack personal website with blog functionality, built with Next.js and Supabase"
date: "2024-01-10"
tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "NextAuth.js", "Vercel"]
demo_url: "https://stevenguan.com"
github_url: "https://github.com/stevenguan/personal-web"
featured_image: "/images/projects/personal-website-hero.jpg"
---

# Personal Website & Blog

A modern, full-stack personal website featuring a blog, project showcase, and interactive commenting system. Built with cutting-edge web technologies for optimal performance and user experience.

## 🚀 Features

### Blog System
- **Code-managed posts** - Write posts in Markdown with front matter
- **Rich content support** - Embedded YouTube videos, code syntax highlighting
- **Tag-based organization** - Categorize and filter posts by tags
- **SEO optimized** - Meta tags, Open Graph, and structured data

### Interactive Elements
- **User authentication** - Google and GitHub OAuth via NextAuth.js
- **Comment system** - Threaded comments with real-time updates
- **Reaction system** - Like, love, and other emoji reactions
- **Responsive design** - Mobile-first, accessible interface

### Project Showcase
- **Dynamic project pages** - Individual pages for each project
- **Tech stack visualization** - Interactive technology badges
- **Live demos** - Direct links to deployed projects
- **GitHub integration** - Repository links and stats

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless backend functions
- **Supabase** - PostgreSQL database with real-time features
- **NextAuth.js** - Authentication and session management
- **Row Level Security** - Database-level access control

### Development & Deployment
- **Vercel** - Deployment and hosting
- **Git-based CMS** - Content management through version control
- **TypeScript** - End-to-end type safety
- **ESLint & Prettier** - Code quality and formatting

## 📁 Project Structure

```
personal_web/
├── app/                    # Next.js App Router pages
├── backend/               # Backend API routes and logic
│   ├── api/              # API route handlers
│   ├── lib/              # Database and auth utilities
│   └── types/            # Backend type definitions
├── frontend/             # Frontend components
│   ├── components/       # React components
│   └── lib/              # Frontend utilities
├── shared/               # Shared utilities and types
│   ├── components/       # Reusable UI components
│   ├── utils/           # Utility functions
│   ├── types/           # Shared type definitions
│   └── constants/       # Application constants
├── content/              # Content management
│   ├── blog/posts/      # Blog post markdown files
│   └── projects/        # Project markdown files
└── database/            # Database schema and migrations
```

## 🎨 Design Philosophy

### User Experience
- **Performance first** - Optimized for Core Web Vitals
- **Accessibility** - WCAG compliant with keyboard navigation
- **Mobile responsive** - Touch-friendly interface design
- **Dark mode** - System preference detection and toggle

### Developer Experience
- **Type safety** - TypeScript throughout the stack
- **Code organization** - Clear separation of concerns
- **Automated testing** - Unit and integration tests
- **CI/CD pipeline** - Automated deployment and quality checks

## 🔧 Key Implementation Details

### Content Management
The blog uses a Git-based CMS approach where posts are written in Markdown with YAML front matter:

```markdown
---
title: "Post Title"
description: "Post description"
date: "2024-01-15"
tags: ["web-dev", "react"]
published: true
---

# Post Content

Your markdown content here...
```

### Database Schema
Supabase PostgreSQL with the following main tables:
- `users` - User profiles and authentication
- `blog_posts` - Blog post metadata and content
- `projects` - Project information and details
- `comments` - Threaded comment system
- `reactions` - User reactions to posts

### Authentication Flow
NextAuth.js handles OAuth with Google and GitHub providers, with user data synchronized to Supabase for additional profile information and permissions.

## 🚀 Performance Optimizations

### Frontend
- **Static generation** - Pre-rendered pages for better SEO
- **Image optimization** - Next.js Image component with WebP
- **Code splitting** - Automatic bundle optimization
- **Caching strategies** - Browser and CDN caching

### Backend
- **Connection pooling** - Efficient database connections
- **Query optimization** - Indexed database queries
- **Error handling** - Comprehensive error boundaries
- **Rate limiting** - API protection against abuse

## 🔮 Future Enhancements

### Planned Features
- **Search functionality** - Full-text search across posts
- **Newsletter signup** - Email subscription system
- **Analytics dashboard** - Visitor and engagement metrics
- **Content scheduling** - Automated post publishing

### Technical Improvements
- **Docker containerization** - Consistent development environment
- **Automated testing** - Comprehensive test coverage
- **Performance monitoring** - Real-time performance tracking
- **A/B testing** - Feature experimentation framework

## 🎯 Lessons Learned

Building this project taught me valuable lessons about:

1. **Full-stack architecture** - Balancing frontend and backend concerns
2. **Database design** - Implementing RLS and efficient queries
3. **Authentication patterns** - Secure user management
4. **Content management** - Git-based vs. traditional CMS approaches
5. **Performance optimization** - Real-world optimization strategies

## 🔗 Links

- **Live Demo**: [stevenguan.com](https://stevenguan.com)
- **GitHub Repository**: [github.com/stevenguan/personal-web](https://github.com/stevenguan/personal-web)
- **Design System**: [Figma Design Files](https://figma.com/design/personal-web)

---

This project represents my approach to modern web development, combining performance, user experience, and developer productivity. Feel free to explore the code and reach out if you have any questions! 