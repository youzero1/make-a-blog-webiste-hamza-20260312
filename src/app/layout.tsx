import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_TITLE || 'My Blog',
    template: `%s | ${process.env.NEXT_PUBLIC_APP_TITLE || 'My Blog'}`,
  },
  description: 'A modern blog built with Next.js 14, TypeScript, and SQLite',
  keywords: ['blog', 'nextjs', 'typescript', 'web development'],
  authors: [{ name: 'Blog Authors' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: process.env.NEXT_PUBLIC_APP_TITLE || 'My Blog',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
