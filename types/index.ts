// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  provider: string;
  provider_id: string;
  created_at: string;
  updated_at: string;
}

// Blog post types
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  categories: string[];
  author: string;
  featured: boolean;
  draft: boolean;
  coverImage?: string;
  readingTime: number;
  content: string;
}

export interface BlogPostFrontmatter {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  tags: string[];
  categories: string[];
  author: string;
  featured: boolean;
  draft: boolean;
  coverImage?: string;
  readingTime: number;
}

// Comment types
export interface Comment {
  id: string;
  post_slug: string;
  user_id: string;
  content: string;
  parent_id?: string;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
  user: User;
  replies?: Comment[];
}

export interface NewComment {
  post_slug: string;
  content: string;
  parent_id?: string;
}

// Reaction types
export type ReactionType = 'like' | 'dislike';

export interface PostReaction {
  id: string;
  post_slug: string;
  user_id: string;
  reaction_type: ReactionType;
  created_at: string;
}

export interface ReactionSummary {
  likes: number;
  dislikes: number;
  userReaction?: ReactionType;
}

// Analytics types
export interface PageView {
  id: string;
  post_slug?: string;
  user_id?: string;
  ip_hash: string;
  user_agent_hash: string;
  created_at: string;
}

export interface AnalyticsData {
  totalViews: number;
  uniqueViews: number;
  topPosts: {
    slug: string;
    title: string;
    views: number;
  }[];
  recentViews: PageView[];
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Email types
export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Search types
export interface SearchResult {
  posts: BlogPost[];
  total: number;
  page: number;
  limit: number;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  current: boolean;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Component prop types
export interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: 'website' | 'article';
  publishedAt?: string;
  tags?: string[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'user'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at' | 'updated_at' | 'user'>>;
      };
      post_reactions: {
        Row: PostReaction;
        Insert: Omit<PostReaction, 'id' | 'created_at'>;
        Update: Partial<Omit<PostReaction, 'id' | 'created_at'>>;
      };
      page_views: {
        Row: PageView;
        Insert: Omit<PageView, 'id' | 'created_at'>;
        Update: Partial<Omit<PageView, 'id' | 'created_at'>>;
      };
    };
  };
} 