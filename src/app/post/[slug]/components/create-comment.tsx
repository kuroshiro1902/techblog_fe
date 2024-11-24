'use client';

import LoginRedirect from '@/components/common/login-redirect';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { createCommentSchema, TComment, TCreateComment } from '@/models/comment.model';
import { PostService } from '@/services/post/post.service';
import useAuthStore from '@/stores/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import defaultAvt from '@/assets/default_avt.png';
import Editor from '@/components/editor/editor';

interface CreateCommentProps {
  postId: number;
  onSuccess: (comment: TComment) => void;
}

function CreateComment({ postId, onSuccess }: CreateCommentProps) {
  const user = useAuthStore((s) => s.user);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting, isValid },
    control,
  } = useForm<TCreateComment>({
    defaultValues: { postId, content: '' },
    resolver: zodResolver(createCommentSchema),
  });
  const handleSubmitComment = async (comment: TCreateComment) => {
    try {
      const newComment = await PostService.createComment(comment);
      onSuccess(newComment);
      setValue('content', '');
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  return user ? (
    <form
      className='py-2 pl-2 flex flex-col gap-2'
      onSubmit={handleSubmit(handleSubmitComment)}
    >
      <div className='flex items-start gap-2'>
        <Image
          className='w-6 aspect-[1/1] rounded-full'
          src={user.avatarUrl ?? defaultAvt}
          alt={user.name ?? ''}
          title={user.name ?? ''}
          width={24}
          height={24}
          quality={50}
        />
        <div className='flex-1'>
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <Editor
                value={field.value}
                onChange={field.onChange}
                placeholder='Viết bình luận...'
                enableImage={false}
              />
            )}
          />
        </div>
      </div>
      <Button className='self-end' disabled={isSubmitting || !isValid} type='submit'>
        {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
      </Button>
    </form>
  ) : (
    <LoginRedirect>Vui lòng đăng nhập để bình luận</LoginRedirect>
  );
}

export default CreateComment;
