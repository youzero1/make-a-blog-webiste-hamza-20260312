import type { Metadata } from 'next';
import Link from 'next/link';
import { getInitializedDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';
import AdminPostList from '@/components/AdminPostList';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Admin panel for managing blog posts',
};

export const dynamic = 'force-dynamic';

async function getAllPosts(): Promise<Post[]> {
  try {
    const ds = await getInitializedDataSource();
    const postRepo = ds.getRepository(Post);
    return await postRepo.find({
      order: { createdAt: 'DESC' },
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function AdminPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts</p>
        </div>
        <Link
          href="/posts/new"
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-700">All Posts</h2>
            <span className="text-sm text-gray-500">{posts.length} total</span>
          </div>
        </div>
        <AdminPostList initialPosts={posts} />
      </div>
    </div>
  );
}
