import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side Supabase client (for browser usage)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for API routes)
export const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper functions for common database operations

/**
 * Sync user from OAuth provider to Supabase
 */
export async function syncUserToSupabase(
  user: any,
  account: any
): Promise<void> {
  try {
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (existingUser) {
      // Update existing user
      await supabaseAdmin
        .from('users')
        .update({
          name: user.name,
          avatar_url: user.image,
          provider: account.provider,
          provider_id: account.providerAccountId,
          updated_at: new Date().toISOString(),
        })
        .eq('email', user.email);
    } else {
      // Create new user
      await supabaseAdmin
        .from('users')
        .insert({
          email: user.email,
          name: user.name,
          avatar_url: user.image,
          provider: account.provider,
          provider_id: account.providerAccountId,
        });
    }
  } catch (error) {
    console.error('Error syncing user to Supabase:', error);
  }
}

/**
 * Get user by email from Supabase
 */
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

/**
 * Get comments for a post
 */
export async function getCommentsByPost(postSlug: string) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users(*)
    `)
    .eq('post_slug', postSlug)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data;
}

/**
 * Create a new comment
 */
export async function createComment(comment: {
  post_slug: string;
  user_id: string;
  content: string;
  parent_id?: string;
}) {
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select(`
      *,
      user:users(*)
    `)
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw error;
  }

  return data;
}

/**
 * Hide/unhide a comment (admin only)
 */
export async function toggleCommentVisibility(
  commentId: string,
  isHidden: boolean
) {
  const { error } = await supabaseAdmin
    .from('comments')
    .update({ is_hidden: isHidden })
    .eq('id', commentId);

  if (error) {
    console.error('Error updating comment visibility:', error);
    throw error;
  }
}

/**
 * Get post reactions
 */
export async function getPostReactions(postSlug: string, userId?: string) {
  // Get reaction counts
  const { data: reactions, error: reactionsError } = await supabase
    .from('post_reactions')
    .select('reaction_type')
    .eq('post_slug', postSlug);

  if (reactionsError) {
    console.error('Error fetching reactions:', reactionsError);
    return { likes: 0, dislikes: 0, userReaction: null };
  }

  const likes = reactions?.filter(r => r.reaction_type === 'like').length || 0;
  const dislikes = reactions?.filter(r => r.reaction_type === 'dislike').length || 0;

  // Get user's reaction if userId provided
  let userReaction = null;
  if (userId) {
    const { data: userReactionData } = await supabase
      .from('post_reactions')
      .select('reaction_type')
      .eq('post_slug', postSlug)
      .eq('user_id', userId)
      .single();

    userReaction = userReactionData?.reaction_type || null;
  }

  return { likes, dislikes, userReaction };
}

/**
 * Add or update user reaction to a post
 */
export async function upsertPostReaction(
  postSlug: string,
  userId: string,
  reactionType: 'like' | 'dislike'
) {
  const { error } = await supabase
    .from('post_reactions')
    .upsert({
      post_slug: postSlug,
      user_id: userId,
      reaction_type: reactionType,
    });

  if (error) {
    console.error('Error upserting reaction:', error);
    throw error;
  }
}

/**
 * Remove user reaction from a post
 */
export async function removePostReaction(postSlug: string, userId: string) {
  const { error } = await supabase
    .from('post_reactions')
    .delete()
    .eq('post_slug', postSlug)
    .eq('user_id', userId);

  if (error) {
    console.error('Error removing reaction:', error);
    throw error;
  }
}

/**
 * Track page view
 */
export async function trackPageView(
  postSlug: string | null,
  userId: string | null,
  ipHash: string,
  userAgentHash: string
) {
  const { error } = await supabase
    .from('page_views')
    .insert({
      post_slug: postSlug,
      user_id: userId,
      ip_hash: ipHash,
      user_agent_hash: userAgentHash,
    });

  if (error) {
    console.error('Error tracking page view:', error);
  }
}

/**
 * Get analytics data
 */
export async function getAnalyticsData() {
  // Get total views
  const { count: totalViews } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true });

  // Get unique views (by IP hash)
  const { data: uniqueViewsData } = await supabase
    .from('page_views')
    .select('ip_hash')
    .not('ip_hash', 'is', null);

  const uniqueViews = new Set(uniqueViewsData?.map(v => v.ip_hash)).size;

  // Get top posts
  const { data: topPostsData } = await supabase
    .from('page_views')
    .select('post_slug')
    .not('post_slug', 'is', null);

  const postCounts: Record<string, number> = {};
  topPostsData?.forEach(view => {
    if (view.post_slug) {
      postCounts[view.post_slug] = (postCounts[view.post_slug] || 0) + 1;
    }
  });

  const topPosts = Object.entries(postCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([slug, views]) => ({ slug, views, title: slug })); // Will need to get actual titles

  return {
    totalViews: totalViews || 0,
    uniqueViews,
    topPosts,
  };
} 