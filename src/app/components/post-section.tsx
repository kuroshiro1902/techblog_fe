// Những bài viết được xem nhiều nhất và những bài viết mới nhất, dùng chung component này

import PostCard from '@/components/post/post-card';
import { TPost } from '@/models/post.model';

interface props {
  posts: TPost[];
  title?: string;
}
// Footer
function PostSection({ posts, title }: props) {
  return (
    <div className='w-full py-4 my-2'>
      <h1 className='mb-2 text-linear-primary'>{title}</h1>
      <ul className='grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center items-center'>
        {posts.map((post, i) => (
          <li key={i} className='w-full h-full'>
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostSection;
