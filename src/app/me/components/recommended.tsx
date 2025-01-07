'use client';

import PostCard from '@/components/post/post-card';
import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import useAuthStore from '@/stores/auth.store';
import { useEffect, useState } from 'react';

function Recommended() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    PostService.getRecommended(4)
      .then((p) => setPosts(p))
      .catch((e) => {
        console.log(e.message);
      });
    return () => setPosts([]);
  }, [user?.id]);
  return (
    <div className='max-w-[300px]'>
      <h3 className='font-bold text-linear-primary'>Có thể bạn sẽ thích</h3>
      {user && (
        <p>
          <i>Những bài viết được gợi ý dựa trên sở thích của bạn.</i>
        </p>
      )}
      <div className='pt-[3px] bg-primary max-w-60'></div>
      <ul>
        {posts.map((p, i) => (
          <li key={i}>
            <PostCard
              post={p}
              hideImage
              hideDetail
              className='bg-background rounded-none shadow-none border-x-0 border-t-0 border-b px-0 py-1'
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommended;
