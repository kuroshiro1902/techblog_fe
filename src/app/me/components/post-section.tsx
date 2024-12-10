'use client';

import PostCard from '@/components/post/post-card';
import PaginationContainer from '@/components/common/pagination-container';
import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import { useCallback } from 'react';

interface PostSectionProps {
  title: string;
  fetchPosts: (
    page: number,
    pageSize: number
  ) => Promise<{
    data: TPost[];
    currentPage: number;
    pageSize: number;
    totalPages: number;
  }>;
}

export default function PostSection({ title, fetchPosts }: PostSectionProps) {
  const renderPost = (post: TPost) => (
    <div key={post.id} className='w-full max-w-[300px]'>
      <PostCard post={post} />
    </div>
  );

  const renderContainer = (items: React.ReactNode[]) => (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center'>
      {items}
    </div>
  );

  return (
    <section className='mt-8'>
      <h2 className='text-current text-2xl font-bold mb-2'>{title}</h2>
      <hr className='mb-2' />
      <PaginationContainer<TPost>
        fetchData={fetchPosts}
        renderItem={renderPost}
        renderContainer={renderContainer}
        config={{
          pageSize: 8,
          initialPage: 1,
          scrollToTop: false,
          paramName: undefined, // Không sử dụng URL params
          preserveQuery: false, // Không giữ query params
        }}
        emptyComponent={
          <div className='text-center py-8 text-gray-500'>Không có bài viết nào.</div>
        }
      />
    </section>
  );
}
