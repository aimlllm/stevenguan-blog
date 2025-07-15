// Shared TypeScript types
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
