import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInitializedDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export const dynamic = 'force-dynamic';

interface PostPageProps {
  params: { id: string };
}

async function getPost(id: number): Promise<Post | null> {
  try {
    const ds = await getInitializedDataSource();
    const postRepo = ds.getRepository(Post);
    return await postRepo.findOne({ where: { id } });
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) return { title: 'Post Not Found' };
  const post = await getPost(id);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      authors: [post.author],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) notFound();

  const post = await getPost(id);
  if (!post) notFound();

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const updatedDate = new Date(post.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className="max-w-3xl mx-auto">
      <nav className="mb-8">
        <Link
          href="/posts"
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Posts
        </Link>
      </nav>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-4">
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="font-medium text-gray-700">{post.author}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Published {formattedDate}
          </span>
          {formattedDate !== updatedDate && (
            <span className="text-gray-400">Updated {updatedDate}</span>
          )}
        </div>
        <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-blue-500 pl-4 italic">
          {post.excerpt}
        </p>
      </header>

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.body }}
      />

      <footer className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-500">Written by</p>
            <p className="font-semibold text-gray-900">{post.author}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href={`/posts/new`}
              className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Write a Post
            </Link>
            <Link
              href="/posts"
              className="border border-gray-300 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              All Posts
            </Link>
          </div>
        </div>
      </footer>
    </article>
  );
}
