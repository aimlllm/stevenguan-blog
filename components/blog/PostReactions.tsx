'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ReactionSummary } from '@/types';

interface PostReactionsProps {
  postSlug: string;
}

export default function PostReactions({ postSlug }: PostReactionsProps) {
  const { data: session } = useSession();
  const [reactions, setReactions] = useState<ReactionSummary>({
    likes: 0,
    dislikes: 0,
    userReaction: undefined,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch reactions on component mount
  useEffect(() => {
    fetchReactions();
  }, [postSlug, session]);

  const fetchReactions = async () => {
    try {
      const userId = (session?.user as any)?.id;
      const params = new URLSearchParams({ postSlug });
      if (userId) params.append('userId', userId);

      const response = await fetch(`/api/reactions?${params}`);
      const result = await response.json();

      if (response.ok) {
        setReactions(result.data);
      } else {
        console.error('Failed to fetch reactions:', result.error);
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (reactionType: 'like' | 'dislike') => {
    if (!session) {
      // Redirect to sign in
      await signIn();
      return;
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    setIsUpdating(true);

    try {
      // If user clicked the same reaction they already have, remove it
      if (reactions.userReaction === reactionType) {
        const params = new URLSearchParams({ postSlug, userId });
        const response = await fetch(`/api/reactions?${params}`, {
          method: 'DELETE',
        });

        const result = await response.json();
        if (response.ok) {
          setReactions(result.data);
        } else {
          console.error('Failed to remove reaction:', result.error);
        }
      } else {
        // Add or update reaction
        const response = await fetch('/api/reactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            postSlug,
            userId,
            reactionType,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          setReactions(result.data);
        } else {
          console.error('Failed to update reaction:', result.error);
        }
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      {/* Like Button */}
      <button
        onClick={() => handleReaction('like')}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          reactions.userReaction === 'like'
            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        title={session ? 'Like this post' : 'Sign in to like this post'}
      >
        <ThumbsUp 
          size={16} 
          className={reactions.userReaction === 'like' ? 'fill-current' : ''} 
        />
        <span className="font-medium">{reactions.likes}</span>
      </button>

      {/* Dislike Button */}
      <button
        onClick={() => handleReaction('dislike')}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
          reactions.userReaction === 'dislike'
            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-700'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
        } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
        title={session ? 'Dislike this post' : 'Sign in to dislike this post'}
      >
        <ThumbsDown 
          size={16} 
          className={reactions.userReaction === 'dislike' ? 'fill-current' : ''} 
        />
        <span className="font-medium">{reactions.dislikes}</span>
      </button>

      {/* Sign in prompt for non-authenticated users */}
      {!session && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={() => signIn()}
            className="underline hover:no-underline"
          >
            Sign in
          </button>{' '}
          to react
        </div>
      )}

      {/* Update indicator */}
      {isUpdating && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Updating...
        </div>
      )}
    </div>
  );
} 