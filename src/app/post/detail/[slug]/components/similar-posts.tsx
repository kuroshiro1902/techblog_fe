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

async function SimilarPosts({ postId }: { postId: number }) {
  const similarPosts = await PostService.getSimilar(postId, 5).catch((e) => {
    console.log(e.message);
    return [] as TPost[];
  });

  return (
    <>
      {similarPosts.length > 0 && (
        <>
          <h3 className='text-linear-primary pb-1'>Bài viết liên quan</h3>
          <Carousel className='relative flex-1'>
            <CarouselContent className='rounded-lg'>
              {similarPosts.map((post, i) => (
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

export default SimilarPosts;
