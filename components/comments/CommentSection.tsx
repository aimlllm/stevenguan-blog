'use client';

import { useState } from 'react';
import CommentForm from './CommentForm';

interface CommentSectionProps {
  postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
  const handleCommentSubmit = async (content: string, parentId?: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postSlug,
          content,
          parentId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit comment');
      }

      // Refresh comments or handle success
      console.log('Comment submitted successfully');
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    }
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold mb-8">Comments</h2>
      
      {/* Comment Form */}
      <CommentForm 
        postSlug={postSlug}
        onSubmit={handleCommentSubmit}
      />
      
      {/* Comments List Placeholder */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          Comments will load here once the database is set up.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Follow the setup instructions in the README to complete the configuration.
        </p>
      </div>
    </div>
  );
} 