'use client';
import { TComment } from '@/models/comment.model';
import { formatDate } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvt from '@/assets/default_avt.png';
import DynamicContent from '@/components/common/dynamic-content';
import { useCallback, useState } from 'react';
import s from './styles.module.scss';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Pencil, InfoIcon } from 'lucide-react';
import { ReplyForm } from './reply-form';
import { PostService } from '@/services/post/post.service';
import { useLoadingStore } from '@/stores/loading.store';
import { toast } from '@/components/hooks/use-toast';
import { TFilterResponse } from '@/models/filter-response.model';
import { usePaginatedComments } from '@/hooks/use-paginated-comments';
import { CommentReactions } from './comment-reactions';
import { EditForm } from './edit-form';
import useAuthStore from '@/stores/auth.store';
import { DeleteComment } from './delete-comment';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import clsx from 'clsx';
import { cn } from '@/lib/utils';
import { ERatingScore } from '@/constant/rating-score.const';

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

function SingleComment({
  comment: initialComment,
  postId,
  onDelete,
}: {
  comment: TComment;
  postId: number;
  onDelete: (commentId: number) => Promise<void>;
}) {
  const {
    comments: replies,
    isLoading,
    loadComments,
    handleLoadMore,
    addComment,
    removeComment,
  } = usePaginatedComments({
    parentCommentId: initialComment.id,
  });
  const [comment, setComment] = useState(initialComment);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const user = useAuthStore((s) => s.user);
  const isOwnComment = user?.id === comment.user.id;

  const handleSubmitReply = useCallback(
    async (content: string) => {
      PostService.createComment({
        postId,
        content,
        parentCommentId: comment.id,
      })
        .then((response) => {
          addComment(response);
          setShowReplyForm(false);
        })
        .catch((error: any) => {
          toast({ title: getApiErrorMessage(error), variant: 'destructive' });
        });
    },
    [addComment, comment.id, postId]
  );

  const handleEditSubmit = useCallback(
    async (content: string) => {
      try {
        const updatedComment = await PostService.updateComment(comment.id, { content });
        // Chỉ update local state của component này
        setComment((prevComment) => ({
          ...prevComment,
          content: updatedComment.content,
          updatedAt: updatedComment.updatedAt,
          impScore: updatedComment.impScore,
        }));
        setIsEditing(false);
      } catch (error: any) {
        toast({
          title: getApiErrorMessage(error),
          variant: 'destructive',
        });
      }
    },
    [comment.id]
  );

  const handleDeleteComment = useCallback(async (commentId: number) => {
    await PostService.deleteComment(commentId).then(() => {
      toast({ title: 'Xóa bình luận thành công.', variant: 'success' });
      removeComment(commentId);
    });
  }, []);

  return (
    <div
      id={`comment-${comment.id}`}
      role='comment'
      className='border border-gray-200 p-2 mt-2 relative'
    >
      <div
        title={`${comment.user.name} ${
          comment.impScore === ERatingScore.LIKE
            ? 'thích'
            : comment.impScore === ERatingScore.DISLIKE
            ? 'không thích'
            : 'trung tính với'
        } bài viết này (Được đánh giá bởi AI).`}
        className={cn(`absolute left-0 top-0`, {
          'bg-green-500/70': comment.impScore === ERatingScore.LIKE,
          'bg-red-500/70': comment.impScore === ERatingScore.DISLIKE,
          'bg-gray-500/70': comment.impScore === null || comment.impScore === ERatingScore.NONE,
        })}
        data-role='comment-sentiment'
        style={{
          width: 12,
          height: 12,
          clipPath: 'polygon(0% 0%, 0% 100%, 100% 0%)',
        }}
      />
      <div className='flex items-center justify-between'>
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
        {isOwnComment && !isEditing && (
          <div>
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0'
              onClick={() => setIsEditing(true)}
              title='Chỉnh sửa bình luận'
            >
              <Pencil style={{ width: 12, height: 12 }} />
            </Button>
            <DeleteComment commentId={comment.id} onDelete={onDelete} />
          </div>
        )}
      </div>

      {isEditing ? (
        <EditForm
          comment={comment}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <DynamicContent
          className='text-sm'
          style={{ paddingBlock: 4, paddingInline: 0 }}
          content={comment.content}
        />
      )}

      {/* Reaction và Reply */}
      <div className={s.commentReaction}>
        <CommentReactions comment={comment} onReplyClick={() => setShowReplyForm(true)} />
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
            <SingleComment
              key={reply.id}
              comment={reply}
              postId={postId}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SingleComment;
