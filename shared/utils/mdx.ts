import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { BlogPost, BlogPostFrontmatter } from '@/types';
import { calculateReadingTime, extractKeywords } from '@/shared/utils/utils';

const POSTS_PATH = path.join(process.cwd(), 'content/posts');

/**
 * Get all blog post files
 */
export function getPostFiles(): string[] {
  if (!fs.existsSync(POSTS_PATH)) {
    fs.mkdirSync(POSTS_PATH, { recursive: true });
    return [];
  }
  
  return fs.readdirSync(POSTS_PATH).filter(file => file.endsWith('.mdx'));
}

/**
 * Get all blog posts with metadata
 */
export function getAllPosts(): BlogPost[] {
  const files = getPostFiles();
  
  const posts = files.map(file => {
    const fullPath = path.join(POSTS_PATH, file);
    const source = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(source);
    
    const frontmatter = data as BlogPostFrontmatter;
    const slug = frontmatter.slug || file.replace('.mdx', '');
    const readingTime = frontmatter.readingTime || calculateReadingTime(content);
    
    // Auto-categorize based on content
    const autoCategories = extractKeywords(content);
    const categories = Array.from(new Set([...frontmatter.categories, ...autoCategories]));
    
    return {
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      publishedAt: frontmatter.publishedAt,
      tags: frontmatter.tags || [],
      categories,
      author: frontmatter.author,
      featured: frontmatter.featured || false,
      draft: frontmatter.draft || false,
      coverImage: frontmatter.coverImage,
      readingTime,
      content,
    };
  });
  
  // Filter out draft posts in production
  const filteredPosts = process.env.NODE_ENV === 'production' 
    ? posts.filter(post => !post.draft)
    : posts;
  
  // Sort by publication date (newest first)
  return filteredPosts.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string): BlogPost | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

/**
 * Get posts by tag
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(post => 
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get featured posts
 */
export function getFeaturedPosts(): BlogPost[] {
  const posts = getAllPosts();
  return posts.filter(post => post.featured);
}

/**
 * Get recent posts
 */
export function getRecentPosts(limit: number = 5): BlogPost[] {
  const posts = getAllPosts();
  return posts.slice(0, limit);
}

/**
 * Serialize MDX content for rendering
 */
export async function serializeMDX(content: string): Promise<MDXRemoteSerializeResult> {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            behavior: 'wrap',
            properties: {
              className: ['anchor-link'],
            },
          },
        ],
      ],
    },
  });
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set<string>();
  
  posts.forEach(post => {
    post.categories.forEach(category => categories.add(category));
  });
  
  return Array.from(categories).sort();
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set<string>();
  
  posts.forEach(post => {
    post.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags).sort();
}

/**
 * Search posts by title, description, or content
 */
export function searchPosts(query: string): BlogPost[] {
  const posts = getAllPosts();
  const searchTerm = query.toLowerCase();
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    post.categories.some(category => category.toLowerCase().includes(searchTerm))
  );
}

/**
 * Get posts with pagination
 */
export function getPaginatedPosts(page: number = 1, limit: number = 10): {
  posts: BlogPost[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNext: boolean;
  hasPrev: boolean;
} {
  const allPosts = getAllPosts();
  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const posts = allPosts.slice(start, end);
  
  return {
    posts,
    totalPosts,
    totalPages,
    currentPage: page,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Get adjacent posts (prev/next)
 */
export function getAdjacentPosts(slug: string): {
  prev: BlogPost | null;
  next: BlogPost | null;
} {
  const posts = getAllPosts();
  const currentIndex = posts.findIndex(post => post.slug === slug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? posts[currentIndex - 1] : null,
    next: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
  };
}

/**
 * Get related posts based on tags and categories
 */
export function getRelatedPosts(post: BlogPost, limit: number = 3): BlogPost[] {
  const posts = getAllPosts();
  const related = posts
    .filter(p => p.slug !== post.slug)
    .map(p => {
      let score = 0;
      
      // Score based on shared tags
      const sharedTags = p.tags.filter(tag => post.tags.includes(tag));
      score += sharedTags.length * 2;
      
      // Score based on shared categories
      const sharedCategories = p.categories.filter(cat => post.categories.includes(cat));
      score += sharedCategories.length * 3;
      
      return { post: p, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
  
  return related;
} 