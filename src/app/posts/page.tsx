import type { Metadata } from 'next';
import Link from 'next/link';
import PostList from '@/components/PostList';
import { getInitializedDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all blog posts',
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

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="text-gray-500 mt-1">{posts.length} post{posts.length !== 1 ? 's' : ''} published</p>
        </div>
        <Link
          href="/posts/new"
          className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-xl font-medium mb-2">No posts yet</p>
          <p className="mb-6">Get started by creating your first blog post.</p>
          <Link
            href="/posts/new"
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Post
          </Link>
        </div>
      ) : (
        <PostList posts={posts} />
      )}
    </div>
  );
}
