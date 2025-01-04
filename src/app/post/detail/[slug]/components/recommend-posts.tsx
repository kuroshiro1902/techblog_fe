'use client';
import PostCard from '@/components/post/post-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import useAuthStore from '@/stores/auth.store';
import { useEffect, useState } from 'react';

function RecommendPosts() {
  const user = useAuthStore((s) => s.user);
  const [recommendPosts, setRecommendPosts] = useState<TPost[]>([]);
  useEffect(() => {
    PostService.getRecommended(6)
      .then((p) => setRecommendPosts(p))
      .catch((e) => {
        console.log(e.message);
      });
  }, [user?.id]);

  return (
    <>
      {recommendPosts.length > 0 && (
        <>
          <h3 className='text-linear-primary pb-1'>Có thể bạn sẽ thích</h3>
          <p>
            <i>Những bài viết được gợi ý dựa trên sở thích của bạn.</i>
          </p>
          <Carousel className='relative flex-1'>
            <CarouselContent className='rounded-lg'>
              {recommendPosts.map((post, i) => (
                <CarouselItem
                  key={i}
                  className='md:basis-1/2 lg:basis-1/4 flex justify-center items-center rounded-lg'
                >
                  <PostCard post={post} hideImage />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </>
      )}
    </>
  );
}

export default RecommendPosts;
