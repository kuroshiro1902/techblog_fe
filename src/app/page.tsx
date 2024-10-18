import Pagination from '@/components/common/pagination';
import SearchForm from '@/components/pages/home/search-form';
import PostCard from '@/components/post/post-card';
import { TFilterResponse } from '@/models/filter-response.model';
import { postFilterSchema, TPose } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { search?: string; pageIndex?: number };
}) {
  const postData: TFilterResponse<TPose> = {
    data: [],
    pageInfo: { hasNextPage: false, pageIndex: 1, pageSize: 16, totalPage: 1 },
  };
  const { error, data: filter } = postFilterSchema.safeParse({
    search: searchParams?.search,
    pageIndex: +(searchParams?.pageIndex ?? 1),
    pageSize: 12,
  });
  if (error) {
    return (
      <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4 '>
        {error.message}
      </main>
    );
  }
  try {
    const { data, pageInfo } = await PostService.filterPosts(filter);
    postData.data = data;
    postData.pageInfo = pageInfo;
  } catch (error) {}

  return (
    <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4 '>
      <SearchForm defaultValue={filter.search} />
      <div className='main'>
        <h3 className='text-primary'>Bài viết dành cho bạn</h3>
        <p>Những bài viết phù hợp với sở thích của bạn.</p>
        <div className='py-4'></div>
        <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 justify-items-center items-center'>
          {postData?.data.map((post, i) => {
            return (
              <li key={i} className='max-w-[300px] h-full'>
                <PostCard post={post} />
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <Pagination totalPage={postData.pageInfo.totalPage} />
      </div>
    </main>
  );
}
