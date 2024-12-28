import { PostService } from '@/services/post/post.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import Image from 'next/image';
import defaultAvt from '@/assets/default_avt.png';
import Link from 'next/link';
import DynamicContent from '@/components/common/dynamic-content';
import { formatDate } from 'date-fns';
async function CommentBlock() {
  try {
    const comments = await PostService.getAllComments({ pageIndex: 1, pageSize: 8 });
    return (
      <div className='p-2 border border-foreground/10 bg-card rounded'>
        <h5 className='text-linear-primary'>Bình luận mới</h5>
        <hr className='py-2' />
        <ul className='flex flex-col gap-4'>
          {comments.data.map((comment) => (
            <li key={comment.id} className='flex gap-2'>
              <div className='flex items-center gap-1'>
                <Image
                  src={comment.user.avatarUrl ?? defaultAvt}
                  alt={comment.user.name}
                  width={24}
                  height={24}
                  className='w-6 aspect-[1/1] rounded-full'
                />
                <a href={`/user/${comment.user.id}`} className='text-sm text-foreground/80'>
                  <span className='underline hover:text-primary'>{comment.user.name}</span>
                  {comment.createdAt && (
                    <time className='text-xs text-foreground/50'>
                      {' '}
                      - {formatDate(comment.createdAt, 'HH:mm dd/MM/yyyy')}
                    </time>
                  )}
                </a>
              </div>
              <a
                className='inline-flex items-center hover:underline'
                href={`/post/detail/${comment?.post?.slug}?commentId=${comment.id}`}
              >
                <div className='text-sm line-clamp-2'>
                  <DynamicContent content={comment.content} />
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  } catch (error: any) {
    return <div>{getApiErrorMessage(error)}</div>;
  }
}

export default CommentBlock;
