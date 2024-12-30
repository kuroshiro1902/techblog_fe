'use client';

import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import useAuthStore from '@/stores/auth.store';
import { useEffect, useState } from 'react';

function Recommended() {
  const [posts, setPosts] = useState<TPost[]>([]);
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    PostService.getRecommended()
      .then((p) => setPosts(p))
      .catch((e) => {
        console.log(e.message);
      });
    return () => setPosts([]);
  }, [user?.id]);
  return (
    <div>
      <h1></h1>
      {posts.map((p, i) => (
        <div key={i}>{p.title}</div>
      ))}
    </div>
  );
}

export default Recommended;
