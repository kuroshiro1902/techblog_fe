'use client';
import { TComment } from '@/models/comment.model';
import { formatDate } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvt from '@/assets/default_avt.png';
import DynamicContent from '@/components/common/dynamic-content';
import { useState } from 'react';

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
function SingleComment({ comment }: { comment: TComment }) {
  const [replies, setReplies] = useState<TComment[]>([]);
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

      <div className='flex flex-col gap-2'>
        {replies.map((reply) => (
          <SingleComment key={reply.id} comment={reply} />
        ))}
      </div>
    </div>
  );
}

export default SingleComment;
