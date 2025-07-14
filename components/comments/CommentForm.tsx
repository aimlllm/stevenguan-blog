'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { MessageCircle, Send } from 'lucide-react';

interface CommentFormProps {
  postSlug: string;
  parentId?: string;
  onSubmit: (content: string, parentId?: string) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
}

export default function CommentForm({ 
  postSlug, 
  parentId, 
  onSubmit, 
  onCancel,
  placeholder = "Share your thoughts..."
}: CommentFormProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(content.trim(), parentId);
      setContent('');
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
        <MessageCircle className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-medium mb-2">Join the Discussion</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Sign in to share your thoughts and engage with the community.
        </p>
        <button
          onClick={() => signIn()}
          className="btn-primary"
        >
          Sign In to Comment
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Community Guidelines */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Community Guidelines
            </h4>
            {showGuidelines ? (
              <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                <p>Please keep comments:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Respectful and constructive</li>
                  <li>On-topic and relevant to the post</li>
                  <li>Free from hate speech, harassment, or spam</li>
                  <li>Professional and thoughtful</li>
                </ul>
                <p className="font-medium">
                  You are responsible for your comments. Inappropriate content will be removed.
                </p>
              </div>
            ) : (
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Be respectful and constructive. Inappropriate comments will be removed.
                <button
                  onClick={() => setShowGuidelines(true)}
                  className="ml-2 underline hover:no-underline"
                >
                  Read full guidelines
                </button>
              </p>
            )}
          </div>
          {showGuidelines && (
            <button
              onClick={() => setShowGuidelines(false)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm"
            >
              Collapse
            </button>
          )}
        </div>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[120px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-gray-100 resize-y"
            required
            disabled={isSubmitting}
          />
          <div className="mt-2 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>
              {content.length}/1000 characters
            </span>
            <span>
              Markdown supported
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Commenting as <strong>{session.user?.name || session.user?.email}</strong>
          </div>
          
          <div className="flex items-center gap-2">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={!content.trim() || isSubmitting || content.length > 1000}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 