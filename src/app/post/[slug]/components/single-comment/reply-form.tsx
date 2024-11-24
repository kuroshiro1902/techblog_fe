'use client';

import { Button } from '@/components/ui/button';
import Editor from '@/components/editor/editor';
import { createCommentSchema, TCreateComment } from '@/models/comment.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

interface ReplyFormProps {
  postId: number;
  parentCommentId: number;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export function ReplyForm({ postId, parentCommentId, onSubmit, onCancel }: ReplyFormProps) {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
    reset,
  } = useForm<TCreateComment>({
    defaultValues: {
      postId,
      parentCommentId,
      content: '',
    },
    resolver: zodResolver(createCommentSchema),
  });

  const handleSubmitReply = async (data: TCreateComment) => {
    try {
      await onSubmit(data.content);
      reset();
    } catch (error) {
      console.error('Failed to submit reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitReply)} className='mt-2 space-y-2'>
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <Editor
            value={field.value}
            onChange={field.onChange}
            placeholder='Viết phản hồi của bạn...'
            enableImage={false}
          />
        )}
      />
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type='submit' disabled={isSubmitting || !isValid}>
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
        </Button>
      </div>
    </form>
  );
}
