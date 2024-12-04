'use client';

import { Button } from '@/components/ui/button';
import Editor from '@/components/editor/editor';
import { updateCommentSchema, TUpdateComment, TComment } from '@/models/comment.model';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';

interface EditFormProps {
  comment: TComment;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export function EditForm({ comment, onSubmit, onCancel }: EditFormProps) {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, isValid, isDirty },
  } = useForm<TUpdateComment>({
    defaultValues: {
      content: comment.content,
    },
    resolver: zodResolver(updateCommentSchema),
  });

  const handleEditSubmit = async (data: TUpdateComment) => {
    try {
      await onSubmit(data.content).then((comment) => {
        reset({
          content: data.content,
        });
      });
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleEditSubmit)} className='mt-2 space-y-2'>
      <Controller
        name='content'
        control={control}
        render={({ field }) => (
          <Editor
            value={field.value}
            onChange={field.onChange}
            placeholder='Nội dung bình luận...'
            enableImage={false}
          />
        )}
      />
      <div className='flex gap-2 justify-end'>
        <Button type='button' variant='outline' onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
        <Button type='submit' disabled={isSubmitting || !isValid || !isDirty}>
          {isSubmitting ? 'Đang lưu...' : 'Lưu'}
        </Button>
      </div>
    </form>
  );
}
