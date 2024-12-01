'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import useAuthStore from '@/stores/auth.store';
import { PostService } from '@/services/post/post.service';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';

interface DeleteCommentProps {
  commentId: number;
  onDelete: (commentId: number) => Promise<void>;
}

export function DeleteComment({ commentId, onDelete }: DeleteCommentProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(commentId);
    } catch (error: any) {
      toast({
        title: getApiErrorMessage(error) ?? 'Không thể xóa bình luận',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant='ghost'
      size='sm'
      className='text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0'
      onClick={handleDelete}
      disabled={isDeleting}
      title='Xóa'
    >
      <Trash2 className='w-4 h-4' style={{ width: 12, height: 12 }} />
      {isDeleting ? 'Đang xóa...' : ''}
    </Button>
  );
}
