import { PostService } from '@/services/post/post.service';
import { notFound, redirect } from 'next/navigation';

interface PostByIdPageProps {
  params: {
    id: string;
  };
}

export default async function PostByIdPage({ params }: PostByIdPageProps) {
  try {
    const postId = parseInt(params.id);

    if (isNaN(postId)) {
      return notFound();
    }

    const post = await PostService.getPostById(postId);

    if (!post) {
      return notFound();
    }

    // Redirect đến trang detail với slug
    redirect(`/post/detail/${post.slug}`);
  } catch (error) {
    console.error('Error fetching post:', error);
    return notFound();
  }
}
