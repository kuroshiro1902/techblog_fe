'use client';

import { useCallback, useEffect, useState } from 'react';
import { BellIcon, MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/stores/auth.store';
import { NotificationService } from '@/services/notification/notification.service';
import { TNotification } from '@/models/notification.model';
import { PostService } from '@/services/post/post.service';
import { useToast } from '@/components/hooks/use-toast';
import Notification from '@/components/notification/notification';
import { ENotificationEvent, useSocket } from '@/stores/socket.store';

const pageSize = 8;
const NotificationList = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null); // Lưu id của notification đang mở
  const { onEvent, offEvent, socket } = useSocket();

  const toggleNotificationList = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = useCallback((id: number) => {
    setActiveMenu((prev) => (prev === id ? null : id)); // Nếu menu đã mở thì đóng, nếu chưa thì mở menu đó
  }, []);

  const markAsRead = useCallback(async (id: number) => {
    // Gọi API để đánh dấu thông báo đã đọc trên server
    NotificationService.markAsRead(id)
      .then((noti) => {
        // Cập nhật trạng thái tại local
        setNotifications((prev) =>
          prev.map((notification) =>
            notification.id === noti.id ? { ...notification, read: true } : notification
          )
        );
        setActiveMenu(null);
      })
      .catch((e) => {});
  }, []);

  const markAllAsRead = useCallback(async () => {
    NotificationService.markAllAsRead()
      .then(() => {
        setNotifications((prev) =>
          prev.map((notification) => ({ ...notification, read: true }))
        );
        toast({ title: 'Đánh dấu tất cả đã đọc thành công.', variant: 'success' });
      })
      .catch((e) => {});
  }, []);

  const unsubscribeFromPost = useCallback(async (postId: number) => {
    // Gọi API để hủy đăng ký nhận thông báo từ bài viết này
    PostService.changePostNotification(postId, false)
      .then(() => {
        toast({ variant: 'success', title: 'Đã tắt thông báo cho bài viết' });
        setActiveMenu(null);
      })
      .catch((e) => {});
  }, []);

  useEffect(() => {
    if (user) {
      NotificationService.getOwnNotifications({ pageIndex: 1, pageSize }).then((res) => {
        if (res) {
          setNotifications(res.data);
        }
      });

      const onWindowClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Kiểm tra nếu click xảy ra bên trong component
        if (target.closest('#notification-container')) return;
        setIsOpen(false);
        setActiveMenu(null);
      };
      // Lắng nghe sự kiện thông báo từ server
      const onNewNotification = (data: TNotification) => {
        setNotifications((prev) => {
          const notis = [data, ...prev];
          const uniqueNotis = notis
            .sort((a, b) => b.id - a.id)
            .filter(
              (n, index, self) => index === self.findIndex((t) => t.id === n.id) // Lọc trùng lặp theo `id`
            );

          const limitedNotis = uniqueNotis.slice(0, pageSize);

          console.log('Socket nhận noti: ', socket?.id);
          return limitedNotis;
        });

        // NotificationService.getOwnNotifications({ pageIndex: 1, pageSize }).then((res) => {
        //   if (res) {
        //     setNotifications(res.data);
        //   }
        // });
      };

      document.addEventListener('click', onWindowClick, { capture: true });

      // Lắng nghe sự kiện thông báo từ server
      onEvent(ENotificationEvent.POST_NEW_COMMENT, onNewNotification);
      onEvent(ENotificationEvent.POST_NEW, onNewNotification);
      return () => {
        document.removeEventListener('click', onWindowClick, { capture: true });
        offEvent(ENotificationEvent.POST_NEW_COMMENT, onNewNotification);
        offEvent(ENotificationEvent.POST_NEW, onNewNotification);
      };
    }
  }, [user, socket, onEvent, offEvent]);

  if (!user) {
    return <></>;
  }

  return (
    <div className='relative inline-block pr-2' id='notification-container'>
      {/* Notification Button */}
      <Button
        title='Thông báo'
        variant='outline'
        className='flex items-center gap-1 !border-none'
        onClick={toggleNotificationList}
      >
        {notifications.some((n) => !n.read) ? (
          <>
            <BellIcon size={20} className='pt-[2px] text-primary' />
            <span className='ml-1 text-primary font-semibold'>
              {notifications.filter((n) => !n.read).length}
            </span>
          </>
        ) : (
          <BellIcon size={20} className='pt-[2px]' />
        )}
      </Button>

      {/* Notification List */}
      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-background shadow shadow-foreground rounded z-50'>
          <div className='px-2 py-1 flex justify-end border-b'>
            <Button onClick={markAllAsRead} className='px-1 h-8 text-xs' variant='outline'>
              Đánh dấu tất cả đã đọc
            </Button>
          </div>
          <div className='max-h-[80vh] overflow-y-auto rounded'>
            {notifications.length > 0 ? (
              notifications.map((notification, i) => (
                <Notification
                  key={i}
                  notification={notification}
                  markAsRead={markAsRead}
                  activeMenu={activeMenu}
                  toggleMenu={toggleMenu}
                  unsubscribeFromPost={unsubscribeFromPost}
                />
              ))
            ) : (
              <div className='p-4 text-center'>Không có thông báo nào</div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className='px-2 flex justify-center'>
              <Button className='px-1 h-8 text-xs text-foreground' variant='link'>
                <a href='/notification' target='_blank'>
                  Xem tất cả
                </a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
