import { NextRequest, NextResponse } from 'next/server';
import { getInitializedDataSource } from '@/lib/database';
import { Post } from '@/entities/Post';

interface RouteParams {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const ds = await getInitializedDataSource();
    const postRepo = ds.getRepository(Post);
    const post = await postRepo.findOne({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('GET /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

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
    const post = await postRepo.findOne({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    post.title = title;
    post.author = author;
    post.excerpt = excerpt;
    post.body = postBody;

    const updatedPost = await postRepo.save(post);
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('PUT /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid post ID' }, { status: 400 });
    }

    const ds = await getInitializedDataSource();
    const postRepo = ds.getRepository(Post);
    const post = await postRepo.findOne({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await postRepo.remove(post);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/posts/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
