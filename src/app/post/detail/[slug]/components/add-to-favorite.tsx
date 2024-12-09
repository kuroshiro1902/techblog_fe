'use client';

import { Button } from '@/components/ui/button';
import { HeartIcon, BellIcon } from 'lucide-react';
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
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kiểm tra trạng thái yêu thích và nhận thông báo khi component được mount
  const fetchFavoriteStatus = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const favoriteStatus = await PostService.isFavoritePost(postId);
      setIsFavorite(!!favoriteStatus);

      // Kiểm tra trạng thái nhận thông báo
      setIsNotificationEnabled(favoriteStatus.notification);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [postId, user]);

  useEffect(() => {
    fetchFavoriteStatus();
  }, [fetchFavoriteStatus]);

  // Thay đổi trạng thái yêu thích bài viết
  const toggleFavorite = async () => {
    if (!user) {
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      if (isFavorite) {
        PostService.deleteFavoritePost(postId)
          .then(() => {
            setIsFavorite(false);
            toast({ variant: 'success', title: 'Đã xóa bài viết khỏi danh sách yêu thích.' });
          })
          .catch((e) => {});
      } else {
        PostService.addFavoritePost(postId)
          .then(() => {
            setIsFavorite(true);
            toast({ variant: 'success', title: 'Đã thêm bài viết vào danh sách yêu thích.' });
            setIsNotificationEnabled(true);
          })
          .catch((e) => {});
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  // Bật/tắt thông báo cho bài viết
  const toggleNotification = async () => {
    if (!user) return;

    setLoading(true);
    try {
      if (isNotificationEnabled) {
        await PostService.changePostNotification(postId, false);
        setIsNotificationEnabled(false);
        toast({ variant: 'success', title: 'Đã tắt thông báo cho bài viết.' });
      } else {
        await PostService.changePostNotification(postId, true);
        setIsNotificationEnabled(true);
        toast({ variant: 'success', title: 'Đã bật thông báo cho bài viết.' });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Có lỗi xảy ra, vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return user ? (
    <div className='flex items-center gap-2'>
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

      {isFavorite && (
        <Button
          variant={isNotificationEnabled ? 'default' : 'outline'}
          className='h-8 px-4 flex items-center'
          onClick={toggleNotification}
          title={
            isNotificationEnabled
              ? 'Bấm để tắt thông báo cho bài viết'
              : 'Bấm để bật thông báo cho bài viết'
          }
          disabled={loading}
        >
          <BellIcon size={14} />
          <span className='ml-2'>
            {isNotificationEnabled ? 'Đang bật thông báo' : 'Bật thông báo'}
          </span>
        </Button>
      )}
    </div>
  ) : (
    <></>
  );
};

export default AddToFavoriteButton;
