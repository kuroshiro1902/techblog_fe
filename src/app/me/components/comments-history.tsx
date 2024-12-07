'use client';

import PostCard from '@/components/post/post-card';
import PaginationContainer from '@/components/common/pagination-container';
import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import { useCallback } from 'react';
import { TOwnRating } from '@/services/post/models/own-rating.model';
import { formatDate } from 'date-fns';
import { TOwnComment } from '@/services/post/models/own-comment.model';

export default function CommentHistory() {
  const fetchPosts = useCallback(async (pageIndex: number, pageSize: number) => {
    const response = await PostService.getOwnComments({
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

  const renderHistory = (comment: TOwnComment) => {
    if (!comment.post) {
      return <p key={comment.id}>Bài viết này đã bị xóa.</p>;
    }
    return (
      <p key={comment.id}>
        <a
          target='_blank'
          href={'/post/detail/' + comment.post?.slug}
          className='hover:underline flex gap-2 items-center'
        >
          {comment.updatedAt && (
            <time className='text-xs'>
              <i>{formatDate(comment.updatedAt, 'HH:mm dd/MM/yyyy')}</i>
            </time>
          )}
          <span className='flex'>
            Bạn đã bình luận &quot;
            <b className='text-ellipsis line-clamp-1'>
              {
                new DOMParser().parseFromString(comment.content ?? '', 'text/html').body
                  .textContent
              }
            </b>
            &quot;.
          </span>
        </a>
      </p>
    );
  };

  const renderContainer = (items: React.ReactNode[]) => <div className=''>{items}</div>;

  return (
    <section className='mt-8'>
      <h2 className='text-current text-2xl font-bold mb-2'>Lịch sử bình luận</h2>
      <hr className='mb-2' />
      <PaginationContainer<TOwnComment>
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
          <div className='text-center py-8 text-gray-500'>Bạn chưa có bình luận nào.</div>
        }
      />
    </section>
  );
}
