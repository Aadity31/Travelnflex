/**
 * Article Comments Component
 * 
 * Displays comments section for article detail pages.
 * Includes comment form and comment list.
 * 
 * @module components/blog/ArticleComments
 */

'use client';

import { useState } from 'react';
import type { Comment } from '@/lib/data/blog/types';

// ============================================
// Props Interface
// ============================================

export interface ArticleCommentsProps {
  /** Comments list */
  comments: Comment[];
  /** Total comment count */
  commentCount: number;
  /** Article ID for posting comments */
  articleId?: string;
}

// ============================================
// Comment Form Component
// ============================================

function CommentForm({ articleId: _articleId }: { articleId?: string }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setStatus('loading');
    
    try {
      // Simulate API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus('success');
      setContent('');
      // Reset after showing success
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 mb-10 shadow-sm">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent h-24 mb-4"
          placeholder="Share your thoughts or ask a question..."
          disabled={status === 'loading'}
        />
        <div className="flex justify-between items-center">
          {status === 'success' && (
            <p className="text-green-600 text-sm font-medium">Comment posted!</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-sm font-medium">Failed to post. Try again.</p>
          )}
          {status === 'idle' && <div />}
          <button 
            type="submit"
            disabled={status === 'loading' || !content.trim()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================
// Single Comment Component
// ============================================

function CommentItem({ comment }: { comment: Comment }) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return formattedDate;
  };

  return (
    <div className="flex gap-4">
      <div 
        className="size-10 rounded-full bg-slate-200 flex-shrink-0 bg-cover bg-center"
        style={comment.author.avatarUrl ? { backgroundImage: `url("${comment.author.avatarUrl}")` } : undefined}
      />
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-sm">{comment.author.name}</span>
          <span className="text-xs text-slate-400">{getRelativeTime(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {comment.content}
        </p>
        <div className="flex gap-4 mt-2">
          <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            Helpful ({comment.helpfulCount})
          </button>
          <button className="text-xs font-bold text-slate-500 flex items-center gap-1 hover:underline">
            Reply
          </button>
        </div>
        
        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4 ml-4 space-y-4 border-l-2 border-slate-200 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Empty State Component
// ============================================

function CommentsEmpty() {
  return (
    <div className="text-center py-8">
      <p className="text-slate-500">
        No comments yet. Be the first to share your thoughts!
      </p>
    </div>
  );
}

// ============================================
// Main Component
// ============================================

export function ArticleComments({
  comments,
  commentCount,
  articleId,
}: ArticleCommentsProps) {
  return (
    <div className="mt-16 pt-8 border-t border-slate-200">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
        Comments ({commentCount})
      </h3>

      {/* Comment Form */}
      <CommentForm articleId={articleId} />

      {/* Comments List */}
      {comments.length === 0 ? (
        <CommentsEmpty />
      ) : (
        <div className="space-y-8">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ArticleComments;
