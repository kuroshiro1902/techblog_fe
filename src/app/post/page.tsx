import Pagination from '@/components/common/pagination';
import SearchPostForm, { ISearchPostParams } from '@/components/form/search-post-form';
import PostCard from '@/components/post/post-card';
import { TFilterResponse } from '@/models/filter-response.model';
import { postFilterSchema, TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import { ArrowRight, ChevronRightIcon, HomeIcon } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import Recommended from './recommended';
import { Logo } from '@/components/layout/logo';

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: ISearchPostParams;
}): Promise<Metadata> {
  const title = searchParams?.search
    ? `Techblog - Tìm kiếm: ${searchParams.search}`
    : 'Techblog - Danh sách bài viết';

  return {
    title,
    description: 'Danh sách các bài viết, chia sẻ kiến thức lập trình và công nghệ mới nhất',
    openGraph: {
      title,
      description: 'Danh sách các bài viết, chia sẻ kiến thức lập trình và công nghệ mới nhất',
    },
    alternates: {
      canonical: '/post',
    },
  };
}

export default async function PostPage({ searchParams }: { searchParams?: ISearchPostParams }) {
  const postData: TFilterResponse<TPost> = {
    data: [],
    pageInfo: { hasNextPage: false, pageIndex: 1, pageSize: 6, totalPage: 1 },
  };

  // Parse and validate search parameters
  const { error, data: filter } = postFilterSchema.safeParse({
    search: searchParams?.search,
    categoryId: Array.isArray(searchParams?.categoryId)
      ? searchParams.categoryId.map((c) => +c) // categoryId là mảng
      : searchParams?.categoryId
      ? [+searchParams.categoryId] // categoryId là chuỗi đơn lẻ
      : [], // categoryId không tồn tại,
    orderBy: searchParams?.orderBy,
    pageIndex: +(searchParams?.pageIndex ?? 1),
  });

  if (error) {
    return (
      <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
        <p className='text-red-500'>{error.message}</p>
      </main>
    );
  }

  // Fetch posts from the service
  console.log({ filter });

  try {
    const { data, pageInfo } = await PostService.filterPosts(filter);
    postData.data = data;
    postData.pageInfo = pageInfo;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  return (
    <>
      {/* <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'> */}
      <main className='max-w-[1400px] m-auto flex flex-col justify-between lg:p-8 p-4'>
        <div className='flex-col place-items-center bg-primary my-4 p-4 text-background relative'>
          <div
            className='absolute inset-0 z-10 opacity-20'
            style={{ backgroundImage: 'url(/img3.webp)', backgroundPosition: 'center' }}
          ></div>
          <Logo className='text-inherit text-4xl' />
          <h4>Nền tảng chia sẻ kiến thức công nghệ trực tuyến!</h4>
        </div>
        <p className='flex gap-2 items-center border-b mb-4'>
          <span className='text-primary flex items-center gap-1'>
            <HomeIcon size={16} />
            <Link href='/'>Trang chủ</Link>
          </span>
          <span>
            <ChevronRightIcon size={16} />
          </span>
          <span>Danh sách bài viết</span>
        </p>
        <div className='flex flex-wrap justify-center gap-4 lg:gap-8'>
          <div className='main flex-1'>
            <h3 className='text-primary'>Khám phá những bài viết hay.</h3>
            <p className='mb-4'>Bạn có thể tìm kiếm bài viết theo tên bài viết, chủ đề, ...</p>
            <SearchPostForm defaultValue={searchParams ?? {}} />
            <div className='py-4'></div>
            <ul className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center items-center'>
              {postData?.data.map((post, i) => (
                <li key={i} className='max-w-[300px] w-full h-full'>
                  <PostCard post={post} className='bg-foreground/5' />
                </li>
              ))}
            </ul>
            {/* Pagination */}
            <div className='mt-4 flex justify-center'>
              <Pagination totalPage={postData.pageInfo.totalPage} />
            </div>
          </div>
          <div className='rounded shadow p-2 self-start'>
            <Recommended />
          </div>
        </div>
      </main>
    </>
  );
}
