'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Post } from '@/entities/Post';
import PostForm from './PostForm';

interface AdminPostListProps {
  initialPosts: Post[];
}

export default function AdminPostList({ initialPosts }: AdminPostListProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setConfirmDeleteId(null);
      router.refresh();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete the post. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSuccess = async () => {
    setEditingPost(null);
    // Refetch posts
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Refetch error:', err);
    }
    router.refresh();
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg font-medium mb-2">No posts found</p>
        <p className="text-sm mb-6">Create your first blog post to see it here.</p>
        <Link
          href="/posts/new"
          className="bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Post
        </Link>
      </div>
    );
  }

  return (
    <div>
      {editingPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Edit Post</h2>
            </div>
            <div className="p-6">
              <PostForm
                mode="edit"
                post={editingPost}
                onCancel={() => setEditingPost(null)}
                onSuccess={handleEditSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {deletingId === confirmDeleteId ? 'Deleting...' : 'Delete'}
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100">
        {posts.map((post) => {
          const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div key={post.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-grow min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{post.title}</h3>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span className="text-gray-300">•</span>
                  <span>{formattedDate}</span>
                  <span className="text-gray-300">•</span>
                  <span className="truncate max-w-xs">{post.excerpt.substring(0, 80)}{post.excerpt.length > 80 ? '...' : ''}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/posts/${post.id}`}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="View post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </Link>
                <button
                  onClick={() => setEditingPost(post)}
                  className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Edit post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setConfirmDeleteId(post.id)}
                  className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete post"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
