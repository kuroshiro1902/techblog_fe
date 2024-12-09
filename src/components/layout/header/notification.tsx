'use client';

import { useCallback, useEffect, useState } from 'react';
import { BellIcon, MoreHorizontalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/stores/auth.store';
import { NotificationService } from '@/services/notification/notification.service';
import { TNotification } from '@/models/notification.model';
import s from './styles.module.scss';
import { PostService } from '@/services/post/post.service';
import { useToast } from '@/components/hooks/use-toast';
const Notification = () => {
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null); // Lưu id của notification đang mở
  const [hasNextPage, setHasNextPage] = useState(false);

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
      NotificationService.getOwnNotifications({ pageIndex: 1, pageSize: 8 }).then((res) => {
        if (res) {
          setNotifications(res.data);
          setHasNextPage(res?.pageInfo?.hasNextPage);
        }
      });

      const onWindowClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Kiểm tra nếu click xảy ra bên trong component
        if (target.closest('#notification-container')) return;
        setIsOpen(false);
        setActiveMenu(null);
      };

      document.addEventListener('click', onWindowClick, { capture: true });
      return () => document.removeEventListener('click', onWindowClick, { capture: true });
    }
  }, [user]);

  if (!user) {
    return <></>;
  }

  return (
    <div className='relative inline-block pr-2' id='notification-container'>
      {/* Notification Button */}
      <Button
        title='Thông báo'
        variant='outline'
        className='flex items-center gap-1'
        onClick={toggleNotificationList}
      >
        <BellIcon size={20} className='pt-[2px]' />
        {notifications.some((n) => !n.read) && (
          <span className='ml-1 text-primary font-semibold'>
            {notifications.filter((n) => !n.read).length}
          </span>
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
              notifications.map((notification) => (
                <div
                  data-role='notification-item'
                  key={notification.id}
                  className={`block px-4 py-2 border-b ${
                    notification.read ? '' : 'bg-primary'
                  } relative`}
                >
                  <a
                    className='block hover:underline'
                    target='_blank'
                    href={
                      notification.itemType === 'post'
                        ? `/post/detail/${notification.post.slug}`
                        : '#'
                    }
                  >
                    <div
                      onClick={() => markAsRead(notification.id)}
                      className={`${s.notificationContent} text-sm text-ellipsis line-clamp-3 ${
                        !notification.read ? 'text-secondary' : ''
                      }`}
                      dangerouslySetInnerHTML={{ __html: notification.messageContent ?? '' }}
                    ></div>
                  </a>

                  {/* 3 dots icon and options */}
                  <div className='absolute z-10 top-1/2 right-2 transform -translate-y-1/2'>
                    <Button
                      className='rounded-full h-8 w-8 bg-foreground/30 hover:bg-foreground/60'
                      variant='link'
                      onClick={(e) => {
                        e.stopPropagation(); // Ngừng lan truyền sự kiện click
                        toggleMenu(notification.id); // Mở/đóng menu
                      }}
                    >
                      <MoreHorizontalIcon size={18} className='text-background' />
                    </Button>

                    {/* Menu */}
                    {activeMenu === notification.id && (
                      <div className='absolute z-20 right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg'>
                        <Button
                          variant='link'
                          className='w-full text-left px-3 py-2 text-sm'
                          onClick={() => markAsRead(notification.id)}
                        >
                          Đánh dấu đã đọc
                        </Button>
                        <Button
                          variant='link'
                          className='w-full text-left px-3 py-2 text-sm text-red-500'
                          onClick={() =>
                            notification.itemType === 'post'
                              ? unsubscribeFromPost(notification.post.id)
                              : null
                          }
                        >
                          Tắt thông báo
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className='p-4 text-center'>Không có thông báo nào</div>
            )}
          </div>
          {hasNextPage && (
            <div className='px-2 flex justify-center'>
              <Button
                onClick={() => markAllAsRead()}
                className='px-1 h-8 text-xs text-foreground'
                variant='link'
              >
                <a href='#'>Xem tất cả</a>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
