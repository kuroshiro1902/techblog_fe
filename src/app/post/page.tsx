import Pagination from '@/components/common/pagination';
import SearchPostForm, { ISearchPostParams } from '@/components/form/search-post-form';
import PostCard from '@/components/post/post-card';
import { TFilterResponse } from '@/models/filter-response.model';
import { postFilterSchema, TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import { Metadata } from 'next';

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
    pageInfo: { hasNextPage: false, pageIndex: 1, pageSize: 16, totalPage: 1 },
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
    <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      {/* Pass searchParams to SearchPostForm */}
      <SearchPostForm defaultValue={searchParams ?? {}} />

      <div className='main'>
        <h3 className='text-primary'>Bài viết dành cho bạn</h3>
        <p>Những bài viết phù hợp với sở thích của bạn.</p>
        <div className='py-4'></div>
        <ul className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center items-center'>
          {postData?.data.map((post, i) => (
            <li key={i} className='max-w-[300px] w-full h-full'>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className='mt-4 flex justify-center'>
        <Pagination totalPage={postData.pageInfo.totalPage} />
      </div>
    </main>
  );
}
