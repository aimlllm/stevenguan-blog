#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting automated project migration...\n');

// Helper functions
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
}

function moveFile(src, dest) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.renameSync(src, dest);
    console.log(`📁 Moved: ${src} → ${dest}`);
  }
}

function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    ensureDir(path.dirname(dest));
    fs.copyFileSync(src, dest);
    console.log(`📄 Copied: ${src} → ${dest}`);
  }
}

function createFile(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
  console.log(`✨ Created: ${filePath}`);
}

// Step 1: Create new directory structure
console.log('📁 Creating new directory structure...');
const directories = [
  'shared/components/ui',
  'shared/components/forms',
  'shared/components/layout',
  'shared/components/media',
  'shared/hooks',
  'shared/utils',
  'shared/types',
  'shared/constants',
  'shared/styles',
  'frontend/components/navigation',
  'frontend/components/comments',
  'frontend/components/reactions',
  'frontend/components/providers',
  'frontend/lib',
  'backend/api/auth',
  'backend/api/blog',
  'backend/api/projects',
  'backend/api/comments',
  'backend/api/reactions',
  'backend/lib/database',
  'backend/lib/auth',
  'backend/lib/validation',
  'backend/middleware',
  'backend/types',
  'content/blog/posts',
  'content/blog/images',
  'content/blog/videos',
  'content/projects',
  'content/projects/assets/images',
  'content/projects/assets/videos',
  'content/pages',
  'database/migrations',
  'database/schemas',
  'database/seeds',
  'docs'
];

directories.forEach(ensureDir);

// Step 2: Move existing files
console.log('\n📦 Moving existing files...');

// Move documentation
moveFile('AUTHENTICATION-FIX-SUMMARY.md', 'docs/authentication-fix-summary.md');
moveFile('RESTRUCTURE_PLAN.md', 'docs/restructure-plan.md');
moveFile('MIGRATION_GUIDE.md', 'docs/migration-guide.md');
moveFile('SUPABASE_FIX.md', 'docs/supabase-fix.md');

// Move existing components to appropriate locations
if (fs.existsSync('components')) {
  const componentFiles = fs.readdirSync('components', { withFileTypes: true });
  
  componentFiles.forEach(file => {
    if (file.isDirectory()) {
      const srcDir = path.join('components', file.name);
      let destDir;
      
      switch (file.name) {
        case 'blog':
          destDir = 'frontend/components/blog';
          break;
        case 'comments':
          destDir = 'frontend/components/comments';
          break;
        case 'ui':
          destDir = 'shared/components/ui';
          break;
        default:
          destDir = `shared/components/${file.name}`;
      }
      
      if (fs.existsSync(srcDir)) {
        ensureDir(destDir);
        execSync(`cp -r ${srcDir}/* ${destDir}/`);
        console.log(`📁 Copied: ${srcDir} → ${destDir}`);
      }
    }
  });
}

// Move lib files
if (fs.existsSync('lib')) {
  const libFiles = fs.readdirSync('lib');
  libFiles.forEach(file => {
    const srcFile = path.join('lib', file);
    if (file.includes('auth') || file.includes('supabase')) {
      moveFile(srcFile, path.join('backend/lib', file));
    } else {
      moveFile(srcFile, path.join('shared/utils', file));
    }
  });
}

// Move utils
if (fs.existsSync('utils')) {
  const utilFiles = fs.readdirSync('utils');
  utilFiles.forEach(file => {
    moveFile(path.join('utils', file), path.join('shared/utils', file));
  });
}

// Move API routes
if (fs.existsSync('app/api')) {
  const apiFiles = fs.readdirSync('app/api', { withFileTypes: true });
  apiFiles.forEach(file => {
    if (file.isDirectory()) {
      const srcDir = path.join('app/api', file.name);
      const destDir = path.join('backend/api', file.name);
      
      if (fs.existsSync(srcDir)) {
        ensureDir(destDir);
        try {
          execSync(`cp -r ${srcDir}/* ${destDir}/`, { stdio: 'pipe' });
          console.log(`📁 Copied: ${srcDir} → ${destDir}`);
        } catch (error) {
          console.log(`⚠️  Skipped empty directory: ${srcDir}`);
        }
      }
    }
  });
}

// Step 3: Create shared configuration files
console.log('\n⚙️ Creating shared configuration files...');

// Create shared types
createFile('shared/types/index.ts', `// Shared TypeScript types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  tags?: string[];
  featured_image?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  demo_url?: string;
  github_url?: string;
  tech_stack: string[];
  featured_image?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  author_id: string;
  post_id: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  id: string;
  type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  user_id: string;
  post_id: string;
  created_at: string;
}
`);

// Create shared constants
createFile('shared/constants/index.ts', `// Shared constants
export const SITE_CONFIG = {
  name: 'Steven Guan',
  title: 'Steven Guan - Full Stack Developer',
  description: 'Personal blog and portfolio of Steven Guan',
  url: 'https://stevenguan.com',
  ogImage: '/images/og-image.jpg',
  links: {
    github: 'https://github.com/stevenguan',
    linkedin: 'https://linkedin.com/in/stevenguan',
    twitter: 'https://twitter.com/stevenguan',
    email: 'hello@stevenguan.com'
  }
};

export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  ABOUT: '/about',
  BLOG: '/blog',
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    ERROR: '/auth/error'
  }
};

export const API_ROUTES = {
  AUTH: '/api/auth',
  BLOG: '/api/blog',
  PROJECTS: '/api/projects',
  COMMENTS: '/api/comments',
  REACTIONS: '/api/reactions'
};

export const REACTION_TYPES = {
  LIKE: 'like',
  LOVE: 'love',
  LAUGH: 'laugh',
  WOW: 'wow',
  SAD: 'sad',
  ANGRY: 'angry'
} as const;
`);

// Create shared utilities
createFile('shared/utils/index.ts', `// Shared utility functions
export * from './format';
export * from './validation';
export * from './api';
export * from './content';
`);

createFile('shared/utils/format.ts', `// Formatting utilities
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return \`\${Math.floor(diffInSeconds / 60)}m ago\`;
  if (diffInSeconds < 86400) return \`\${Math.floor(diffInSeconds / 3600)}h ago\`;
  if (diffInSeconds < 2592000) return \`\${Math.floor(diffInSeconds / 86400)}d ago\`;
  
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
}
`);

console.log('\n✅ Migration completed successfully!');
console.log('📝 Next steps:');
console.log('1. Run: npm install');
console.log('2. Update import paths in your components');
console.log('3. Test the application');
console.log('4. Commit changes: git add . && git commit -m "feat: restructure project with shared utilities"'); 