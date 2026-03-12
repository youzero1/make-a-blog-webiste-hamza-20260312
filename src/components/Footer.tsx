import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  const appTitle = process.env.NEXT_PUBLIC_APP_TITLE || 'My Blog';

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 max-w-5xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <Link href="/" className="text-lg font-bold text-blue-600">
              {appTitle}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              Built with Next.js 14, TypeScript & SQLite
            </p>
          </div>
          <nav className="flex gap-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link href="/posts" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Posts
            </Link>
            <Link href="/posts/new" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              New Post
            </Link>
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
              Admin
            </Link>
          </nav>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">© {year} {appTitle}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
