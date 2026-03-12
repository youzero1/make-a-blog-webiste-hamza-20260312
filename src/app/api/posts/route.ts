import { NextRequest, NextResponse } from 'next/server';
import { getInitializedDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

export async function GET() {
  try {
    const ds = await getInitializedDataSource();
    const postRepo = ds.getRepository(Post);
    const posts = await postRepo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, excerpt, body: postBody } = body;

    if (!title || !author || !excerpt || !postBody) {
      return NextResponse.json(
        { error: 'All fields (title, author, excerpt, body) are required' },
        { status: 400 }
      );
    }

    const ds = await getInitializedDataSource();
    const postRepo = ds.getRepository(Post);

    const post = postRepo.create({ title, author, excerpt, body: postBody });
    const savedPost = await postRepo.save(post);

    return NextResponse.json(savedPost, { status: 201 });
  } catch (error) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
