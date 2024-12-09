'use client';

import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { PostService } from '@/services/post/post.service';
import { useToast } from '@/components/hooks/use-toast';
import useAuthStore from '@/stores/auth.store';

interface AddToFavoriteButtonProps {
  postId: number;
}

const AddToFavoriteButton = ({ postId }: AddToFavoriteButtonProps) => {
  const { toast } = useToast();
  const user = useAuthStore((s) => s.user);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra trạng thái yêu thích khi component được mount
  const fetchFavoriteStatus = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const favoriteStatus = await PostService.isFavoritePost(postId);
      setIsFavorite(!!favoriteStatus);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

  const toggleFavorite = async () => {
    if (!user) {
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      if (isFavorite) {
        await PostService.deleteFavoritePost(postId);
        setIsFavorite(false);
        toast({ variant: 'success', title: 'Đã xóa bài viết khỏi danh sách yêu thích.' });
      } else {
        await PostService.addFavoritePost(postId);
        setIsFavorite(true);
        toast({ variant: 'success', title: 'Đã thêm bài viết vào danh sách yêu thích.' });
      }
    } catch (error) {
      // console.error('Lỗi khi thay đổi trạng thái yêu thích:', error);
      // toast({ variant: 'destructive', title: 'Có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return user ? (
    <Button
      variant={isFavorite ? 'default' : 'outline'}
      className='h-8 px-4 flex items-center'
      onClick={toggleFavorite}
      title={isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
      disabled={loading}
    >
      <HeartIcon size={14} />
      <span className='ml-2'>{isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}</span>
    </Button>
  ) : (
    <></>
  );
};

export default AddToFavoriteButton;
