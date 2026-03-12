import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Post } from '@/entities/Post';
import path from 'path';

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), './data/blog.sqlite');

let AppDataSource: DataSource | null = null;

export function getDataSource(): DataSource {
  if (!AppDataSource) {
    AppDataSource = new DataSource({
      type: 'better-sqlite3',
      database: dbPath,
      synchronize: true,
      logging: false,
      entities: [Post],
    });
  }
  return AppDataSource;
}

let initializationPromise: Promise<DataSource> | null = null;

export async function getInitializedDataSource(): Promise<DataSource> {
  const ds = getDataSource();
  if (ds.isInitialized) {
    return ds;
  }
  if (!initializationPromise) {
    initializationPromise = ds.initialize().then(async (initializedDs) => {
      await seedDatabase(initializedDs);
      return initializedDs;
    }).catch((err) => {
      initializationPromise = null;
      throw err;
    });
  }
  return initializationPromise;
}

async function seedDatabase(ds: DataSource): Promise<void> {
  const postRepo = ds.getRepository(Post);
  const count = await postRepo.count();
  if (count > 0) return;

  const samplePosts = [
    {
      title: 'Welcome to My Blog',
      author: 'Jane Doe',
      excerpt: 'An introduction to this blog and what you can expect to find here.',
      body: `<h2>Welcome!</h2><p>Hello and welcome to my blog! I'm so excited to have you here. This is a place where I'll be sharing my thoughts, experiences, and knowledge on a wide range of topics.</p><p>Whether you're interested in technology, travel, food, or just life in general, there's something here for everyone. I plan to post regularly, so make sure to check back often for new content.</p><h2>What to Expect</h2><p>Here's a quick overview of what you can look forward to:</p><ul><li>In-depth technical tutorials</li><li>Personal stories and reflections</li><li>Reviews of books and tools</li><li>And much more!</li></ul><p>Thank you for joining me on this journey. I hope you enjoy reading as much as I enjoy writing!</p>`,
    },
    {
      title: 'Getting Started with Next.js 14',
      author: 'John Smith',
      excerpt: 'A comprehensive guide to building modern web applications with Next.js 14 and the App Router.',
      body: `<h2>Introduction to Next.js 14</h2><p>Next.js 14 is a powerful React framework that makes building full-stack web applications a breeze. With the introduction of the App Router, the way we structure and build applications has fundamentally changed for the better.</p><h2>Key Features</h2><p>Next.js 14 comes packed with amazing features:</p><ul><li><strong>App Router</strong>: A new file-system based router built on React Server Components</li><li><strong>Server Actions</strong>: Write server-side logic directly in your components</li><li><strong>Turbopack</strong>: An incremental bundler built on Rust for faster development</li><li><strong>Image Optimization</strong>: Automatic image optimization for better performance</li></ul><h2>Getting Started</h2><p>To create a new Next.js project, run the following command:</p><pre><code>npx create-next-app@latest my-app</code></pre><p>This will scaffold a new project with all the necessary configurations. You can then navigate to your project directory and start the development server.</p><h2>Conclusion</h2><p>Next.js 14 is a fantastic choice for building modern web applications. Its combination of performance, developer experience, and flexibility makes it one of the best frameworks available today.</p>`,
    },
    {
      title: 'The Beauty of TypeScript',
      author: 'Alice Johnson',
      excerpt: 'Why TypeScript has become an essential tool for modern JavaScript development and how it can improve your code quality.',
      body: `<h2>Why TypeScript?</h2><p>TypeScript has taken the JavaScript world by storm, and for good reason. As applications grow in complexity, the need for better tooling and type safety becomes increasingly important.</p><h2>Key Benefits</h2><p>Here are some of the main benefits of using TypeScript:</p><ol><li><strong>Type Safety</strong>: Catch errors at compile time rather than runtime</li><li><strong>Better IDE Support</strong>: Get incredible autocomplete, refactoring tools, and code navigation</li><li><strong>Self-Documenting Code</strong>: Types serve as documentation for your codebase</li><li><strong>Easier Refactoring</strong>: Confidently refactor large codebases with TypeScript's help</li><li><strong>Modern JavaScript Features</strong>: Use the latest JS features with proper type support</li></ol><h2>Getting Started with TypeScript</h2><p>Adding TypeScript to an existing project is easier than ever. Most modern frameworks like Next.js have first-class TypeScript support built in.</p><p>Simply rename your <code>.js</code> files to <code>.ts</code> (or <code>.tsx</code> for React components) and start adding types. TypeScript is designed to be gradually adopted, so you don't have to convert everything at once.</p><h2>Conclusion</h2><p>Whether you're working on a small personal project or a large enterprise application, TypeScript can help you write better, more maintainable code. Give it a try if you haven't already!</p>`,
    },
  ];

  for (const postData of samplePosts) {
    const post = postRepo.create(postData);
    await postRepo.save(post);
  }

  console.log('Database seeded with sample posts.');
}
