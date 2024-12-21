'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/hooks/use-toast';
import { UserService } from '@/services/user/user.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { Bell, UserCheck, UserPlus, UserPlusIcon } from 'lucide-react';
import { UserMinusIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuthStore from '@/stores/auth.store';
import { IUser } from '@/models/user.model';
import { LoadingOverlay } from '@/components/layout/loading';
import { useLoadingStore } from '@/stores/loading.store';

interface FollowButtonProps {
  userId: number;
}

export function FollowButton({ userId }: FollowButtonProps) {
  const user = useAuthStore((s) => s.user);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const { executeWithLoading, isLoading } = useLoadingStore();
  const { toast } = useToast();

  useEffect(() => {
    executeWithLoading(async () => {
      const { data } = await UserService.getUserFollow(userId);
      if (data) {
        setIsFollowing(true);
        setIsNotification(data.notification);
      }
    });
  }, [user?.id, userId, executeWithLoading]);

  const handleFollow = async () => {
    try {
      const follow = !isFollowing;
      if (
        confirm(
          `Bạn có chắc chắn muốn ${isFollowing ? 'bỏ theo dõi' : 'theo dõi'} người dùng này?`
        )
      ) {
        executeWithLoading(async () => {
          const { data } = await UserService.followUser(userId, follow);
          toast({
            variant: 'success',
            title: follow ? 'Đã theo dõi' : 'Đã bỏ theo dõi',
          });
          setIsFollowing(follow);
          setIsNotification(data?.notification ?? false);
        });
      }
    } catch (error: any) {
      toast({
        title: getApiErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  const handleNotification = async () => {
    try {
      const notification = !isNotification;
      await UserService.followNotification(userId, notification);
      setIsNotification(notification);
      toast({
        variant: notification ? 'success' : 'default',
        title: `Bạn sẽ ${
          notification ? '' : 'không'
        } nhận được thông báo về những bài viết mới của người dùng này trong tương lai.`,
      });
    } catch (error: any) {
      toast({
        title: getApiErrorMessage(error),
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Button
        title={isFollowing ? 'Đã theo dõi' : 'Theo dõi'}
        variant={isFollowing ? 'default' : 'outline'}
        onClick={handleFollow}
        disabled={isLoading}
      >
        {isFollowing ? <UserCheck /> : <UserPlus />}
      </Button>
      {isFollowing && (
        <Button
          title={isNotification ? 'Đang bật thông báo' : 'Bật thông báo'}
          variant={isNotification ? 'default' : 'outline'}
          onClick={handleNotification}
          disabled={isLoading}
        >
          <Bell />
        </Button>
      )}
    </>
  );
}
