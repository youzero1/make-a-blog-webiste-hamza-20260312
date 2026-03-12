import type { Metadata } from 'next';
import PostForm from '@/components/PostForm';

export const metadata: Metadata = {
  title: 'New Post',
  description: 'Create a new blog post',
};

export default function NewPostPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-500 mt-2">Share your thoughts with the world</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <PostForm mode="create" />
      </div>
    </div>
  );
}
