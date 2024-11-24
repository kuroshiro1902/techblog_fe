'use client';
import { TComment } from '@/models/comment.model';
import { formatDate } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvt from '@/assets/default_avt.png';
import DynamicContent from '@/components/common/dynamic-content';
import { useState } from 'react';
import s from './styles.module.scss';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ReplyForm } from './reply-form';
import { PostService } from '@/services/post/post.service';
import { useLoadingStore } from '@/stores/loading.store';
import { toast } from '@/components/hooks/use-toast';
import { TFilterResponse } from '@/models/filter-response.model';
import { usePaginatedComments } from '@/hooks/use-paginated-comments';

const CommentHeader = ({ comment }: { comment: TComment }) => {
  return (
    <div className='flex flex-col'>
      <p className='text-primary font-bold text-sm text-ellipsis overflow-hidden max-w-[300px] leading-[1.2]'>
        {comment?.user?.name}
      </p>
      <p className='leading-[1.2]'>
        {comment.createdAt && (
          <time className='text-xs text-gray-700 inline'>
            {formatDate(comment.createdAt, 'HH:mm dd/MM/yyyy')}
          </time>
        )}
        {comment.updatedAt && comment.createdAt !== comment.updatedAt && (
          <span className='text-xs text-gray-500 p-1'>
            (Cập nhật lần cuối: <time>{formatDate(comment.updatedAt, 'HH:mm dd/MM/yyyy')}</time>
            )
          </span>
        )}
      </p>
    </div>
  );
};

function SingleComment({ comment, postId }: { comment: TComment; postId: number }) {
  const {
    comments: replies,
    isLoading,
    loadComments,
    handleLoadMore,
    addComment,
  } = usePaginatedComments({
    parentCommentId: comment.id,
  });
  const [showReplyForm, setShowReplyForm] = useState(false);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);

  const handleSubmitReply = async (content: string) => {
    await executeWithLoading(async () => {
      const response = await PostService.createComment({
        postId,
        content,
        parentCommentId: comment.id,
      });
      addComment(response);
      setShowReplyForm(false);
    });
  };

  return (
    <div
      id={`comment-${comment.id}`}
      role='comment'
      className='border border-gray-200 p-2 mt-2'
    >
      <div className='flex items-center gap-2'>
        <Link
          title={comment?.user.name}
          href={`/user/${comment?.user?.id}`}
          target='_blank'
          className='pt-1 flex items-center gap-2'
        >
          <Image
            className='w-6 aspect-[1/1] rounded-full'
            src={comment?.user.avatarUrl ?? defaultAvt}
            alt={comment?.user.name ?? ''}
            width={24}
            height={24}
            quality={50}
          />
          <CommentHeader comment={comment} />
        </Link>
      </div>
      <DynamicContent
        className='text-sm'
        style={{ paddingBlock: 4, paddingInline: 0 }}
        content={comment.content}
      />

      {/* Reaction và Reply */}
      <div className={s.commentReaction}>
        <div data-role='reaction' className='flex items-center gap-2'>
          <Button variant='outline' title='Thích' className='flex items-center gap-1'>
            <ThumbsUp style={{ width: 14, height: 14 }} />
            {(comment.likes ?? 0) > 0 && <span className='text-xs'>{comment.likes}</span>}
          </Button>
          <Button variant='outline' title='Không thích' className='flex items-center gap-1'>
            <ThumbsDown style={{ width: 14, height: 14 }} />
            {(comment.dislikes ?? 0) > 0 && <span className='text-xs'>{comment.dislikes}</span>}
          </Button>
          <Button
            className='!leading-[1.35]'
            variant='ghost'
            onClick={() => {
              setShowReplyForm(true);
              handleLoadMore();
            }}
          >
            Trả lời
          </Button>
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && (
        <ReplyForm
          postId={postId}
          parentCommentId={comment.id}
          onSubmit={handleSubmitReply}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* Load more replies button */}
      {replies.pageInfo.hasNextPage && (
        <div className='mt-2'>
          <Button variant='ghost' size='sm' onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? 'Đang tải...' : 'Xem phản hồi'}
          </Button>
        </div>
      )}

      {/* Replies */}
      {replies.data.length > 0 && (
        <div className='pl-4 mt-2 border-l-2 border-gray-200'>
          {replies.data.map((reply) => (
            <SingleComment key={reply.id} comment={reply} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SingleComment;
