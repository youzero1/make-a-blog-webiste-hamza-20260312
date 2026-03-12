import type { Metadata } from 'next';
import Link from 'next/link';
import PostList from '@/components/PostList';
import { getInitializedDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to My Blog - Read the latest posts on technology, development, and more.',
};

export const dynamic = 'force-dynamic';

async function getPosts(): Promise<Post[]> {
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

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 mb-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {process.env.NEXT_PUBLIC_APP_TITLE || 'My Blog'}
        </h1>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto px-4">
          Thoughts, stories, and ideas on technology, development, and beyond.
        </p>
        <div className="flex gap-4 justify-center flex-wrap px-4">
          <Link
            href="/posts"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse All Posts
          </Link>
          <Link
            href="/posts/new"
            className="bg-blue-500 bg-opacity-30 border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-opacity-50 transition-colors"
          >
            Write a Post
          </Link>
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            View all →
          </Link>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-xl mb-4">No posts yet.</p>
            <Link
              href="/posts/new"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Be the first to write one!
            </Link>
          </div>
        ) : (
          <PostList posts={posts} />
        )}
      </section>
    </div>
  );
}
