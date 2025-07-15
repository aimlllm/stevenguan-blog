import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser/public operations
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'X-Client-Info': 'personal-web@1.0.0',
      },
    },
    db: {
      schema: 'public',
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Admin client for server-side operations
export const supabaseAdmin: SupabaseClient<Database> = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'personal-web-admin@1.0.0',
      },
    },
  }
);

// Database operation helpers
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
    }
  }
  
  throw lastError!;
}

export async function handleDatabaseError<T>(
  operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const result = await withRetry(operation);
    
    if (result.error) {
      console.error('Database operation failed:', result.error);
      throw new Error(`Database error: ${result.error.message || 'Unknown error'}`);
    }
    
    if (result.data === null) {
      throw new Error('No data returned from database operation');
    }
    
    return result.data;
  } catch (error) {
    console.error('Database operation failed:', error);
    throw error;
  }
}

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
      .single();
    
    return !error;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// User management functions
export async function createOrUpdateUser(user: {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}) {
  return handleDatabaseError(async () => {
    return await supabaseAdmin
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
  });
}

export async function getUserById(id: string) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
  });
}

// Blog post functions
export async function getBlogPosts(published: boolean = true) {
  return handleDatabaseError(async () => {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (published) {
      query = query.eq('published', true);
    }
    
    return await query;
  });
}

export async function getBlogPostBySlug(slug: string) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
  });
}

export async function createBlogPost(post: {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author_id: string;
  published?: boolean;
  tags?: string[];
  featured_image?: string;
}) {
  return handleDatabaseError(async () => {
    return await supabaseAdmin
      .from('blog_posts')
      .insert({
        ...post,
        published: post.published ?? false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
  });
}

// Project functions
export async function getProjects() {
  return handleDatabaseError(async () => {
    return await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
  });
}

export async function getProjectBySlug(slug: string) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();
  });
}

// Comment functions
export async function getCommentsByPostId(postId: string) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('comments')
      .select(`
        *,
        users:author_id (
          id,
          name,
          avatar
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
  });
}

export async function createComment(comment: {
  content: string;
  author_id: string;
  post_id: string;
  parent_id?: string;
}) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('comments')
      .insert({
        ...comment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        users:author_id (
          id,
          name,
          avatar
        )
      `)
      .single();
  });
}

// Reaction functions
export async function getReactionsByPostId(postId: string) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('reactions')
      .select('*')
      .eq('post_id', postId);
  });
}

export async function createOrUpdateReaction(reaction: {
  type: string;
  user_id: string;
  post_id: string;
}) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('reactions')
      .upsert({
        ...reaction,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
  });
}

export async function deleteReaction(userId: string, postId: string) {
  return handleDatabaseError(async () => {
    return await supabase
      .from('reactions')
      .delete()
      .eq('user_id', userId)
      .eq('post_id', postId);
  });
} 