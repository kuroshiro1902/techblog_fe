'use client';

import PostCard from '@/components/post/post-card';
import PaginationContainer from '@/components/common/pagination-container';
import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import { useCallback } from 'react';
import { TOwnRating } from '@/services/post/models/own-rating.model';
import { formatDate } from 'date-fns';

export default function RatingHistory() {
  const fetchPosts = useCallback(async (pageIndex: number, pageSize: number) => {
    const response = await PostService.getOwnRatings({
      pageIndex,
      pageSize,
    });

    return {
      data: response.data,
      currentPage: response.pageInfo.pageIndex,
      pageSize: response.pageInfo.pageSize,
      totalPages: response.pageInfo.totalPage,
    };
  }, []);

  const renderHistory = (rating: TOwnRating) => {
    const like = (rating?.score ?? 0) > 0;
    if (!rating.post) {
      return <p>Bài viết này đã bị xóa.</p>;
    }
    return (
      <p>
        <a
          target='_blank'
          href={'/post/detail/' + rating.post?.slug}
          key={rating.id}
          className='hover:underline'
        >
          {rating.updatedAt && (
            <time className='text-xs mr-2'>
              <i>{formatDate(rating.updatedAt, 'HH:mm dd/MM/yyyy')}</i>
            </time>
          )}
          <span>
            Bạn đã {like ? 'thích' : 'thông thích'} <b>{rating.post?.title}</b>.
          </span>
        </a>
      </p>
    );
  };

  const renderContainer = (items: React.ReactNode[]) => <div className=''>{items}</div>;

  return (
    <section className='mt-8'>
      <h2 className='text-current text-2xl font-bold mb-2'>Lịch sử tương tác</h2>
      <hr className='mb-2' />
      <PaginationContainer<TOwnRating>
        fetchData={fetchPosts}
        renderItem={renderHistory}
        renderContainer={renderContainer}
        config={{
          pageSize: 8,
          initialPage: 1,
          scrollToTop: false,
          paramName: undefined, // Không sử dụng URL params
          preserveQuery: false, // Không giữ query params
        }}
        emptyComponent={
          <div className='text-center py-8 text-gray-500'>
            Bạn chưa tương tác với bài viết nào.
          </div>
        }
      />
    </section>
  );
}
