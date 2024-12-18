import { TFilterResponse } from '@/models/filter-response.model';
import { postFilterSchema, TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import Slider from './components/slider';
import Greeting from './components/greeting';
import { Button } from '@/components/ui/button';
import { ArrowRightCircleIcon } from 'lucide-react';
import CategorySection from './components/category-section';
import Link from 'next/link';

import { Metadata } from 'next';
import { ISearchPostParams } from '@/components/form/search-post-form';
import PostSection from './components/post-section';

export async function generateMetadata(): Promise<Metadata> {
  const title = `Tech Blog - Nền tảng chia sẻ kiến thức công nghệ trực tuyến.`;

  return {
    title,
    description: title,
    openGraph: {
      title,
      description: title,
    },
    alternates: {
      canonical: '/',
    },
  };
}

const Wave = () => (
  // Sóng
  <div className='absolute bottom-0 left-0 w-full'>
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 100 30' // Tạo tỉ lệ cho phần đường sóng nhỏ
      preserveAspectRatio='xMinYMin slice' // Đảm bảo đường sóng sẽ co dãn tự động
      width='100%' // Tự động co dãn theo chiều rộng màn hình
      height='120' // Giữ chiều cao cố định
      className='fill-background'
    >
      <path d='M0,0 C10,15 40,5 60,0 C80,5 90,7 100,0 L100,30 L0,30 Z' />
    </svg>
  </div>
);

export default async function HomePage() {
  const hotPosts: TPost[] = [];
  const newPosts: TPost[] = [];
  try {
    const [hotPostRes, newPostRes] = await Promise.allSettled([
      PostService.filterPosts({ orderBy: 'views-desc', pageSize: 2 }),
      PostService.filterPosts({ orderBy: 'createdAt-desc', pageSize: 2 }),
    ]);
    hotPostRes.status === 'fulfilled' && hotPosts.push(...hotPostRes.value.data);
    newPostRes.status === 'fulfilled' && newPosts.push(...newPostRes.value.data);
  } catch (error) {}

  return (
    <main className='flex flex-col justify-between'>
      <div className='px-8 py-6 mb-2 mt-4 relative bg-gradient-to-t from-primary/70 via-primary/50 to-secondary/70'>
        <Greeting />
        <Slider />
        <Wave />
      </div>
      <p className='text-center relative z-[1]'>
        <Link href='/post'>
          <Button size={'lg'} className='h-14 text-lg'>
            Khám phá <ArrowRightCircleIcon />
          </Button>
        </Link>
      </p>
      <div className='max-w-screen-lg m-auto px-2 py-4 lg:py-8 w-full'>
        <CategorySection />
        <PostSection title='Bài viết nổi bật' posts={hotPosts} />
        <PostSection title='Bài viết mới nhất' posts={newPosts} />
      </div>
    </main>
  );
}
