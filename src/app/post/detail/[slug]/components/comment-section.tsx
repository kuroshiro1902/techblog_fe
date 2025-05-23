'use client';

import { TComment } from '@/models/comment.model';
import { PostService } from '@/services/post/post.service';
import { useCallback, useEffect, useState } from 'react';
import CreateComment from './create-comment';
import SingleComment from './single-comment/single-comment';
import { TFilterResponse } from '@/models/filter-response.model';
import { Button } from '@/components/ui/button';
import { usePaginatedComments } from '@/hooks/use-paginated-comments';
import { toast } from '@/hooks/use-toast';

interface CommentProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentProps) {
  const { comments, isLoading, handleLoadMore, addComment, removeComment } =
    usePaginatedComments({
      postId,
    });
  const handleDeleteComment = useCallback(async (commentId: number) => {
    await PostService.deleteComment(commentId).then(() => {
      toast({ title: 'Xóa bình luận thành công.', variant: 'success' });
      removeComment(commentId);
    });
  }, []);

  return (
    <div className='mt-4'>
      <span className='font-bold text-lg'>Bình luận</span>
      <hr className='mb-2' />
      <CreateComment postId={postId} onSuccess={addComment} />
      <div className='mt-2 space-y-2'>
        {comments.data.map((comment) => (
          <SingleComment
            key={comment.id}
            postId={postId}
            comment={comment}
            onDelete={handleDeleteComment}
          />
        ))}

        <div className='flex justify-center mt-4'>
          <Button
            variant='outline'
            onClick={handleLoadMore}
            disabled={isLoading || !comments.pageInfo.hasNextPage}
          >
            {isLoading
              ? 'Đang tải...'
              : comments.pageInfo.hasNextPage
              ? `Xem thêm bình luận`
              : `Hết`}
          </Button>
        </div>
      </div>
    </div>
  );
}
