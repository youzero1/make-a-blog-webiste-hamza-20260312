import PostCard from '@/components/PostCard';
import { Post } from '@/entities/Post';

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
