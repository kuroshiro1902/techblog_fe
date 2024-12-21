'use client';
import { useToast } from '@/components/hooks/use-toast';
import Notification from '@/components/notification/notification';
import { Button } from '@/components/ui/button';
import { TNotification } from '@/models/notification.model';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { NotificationService } from '@/services/notification/notification.service';
import { PostService } from '@/services/post/post.service';
import useAuthStore from '@/stores/auth.store';
import { ENotificationEvent, useSocket } from '@/stores/socket.store';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

function NotificationPage() {
  const [auth, setAuth] = useState(false);
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [activeMenu, setActiveMenu] = useState<number | null>(null); // Lưu id của notification đang mở
  const [hasNextPage, setHasNextPage] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const { onEvent, offEvent, socket } = useSocket();

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
      .then(({}) => {
        toast({ variant: 'success', title: 'Đã tắt thông báo cho bài viết' });
        setActiveMenu(null);
        return;
      })
      .catch((e) => {});
  }, []);

  const loadMoreNotifications = useCallback(async () => {
    const nextPageIndex = pageIndex + 1;

    try {
      const res = await NotificationService.getOwnNotifications({
        pageIndex: nextPageIndex,
        pageSize: 8,
      });

      if (res) {
        setNotifications((prev) => [...prev, ...res.data]);
        setHasNextPage(res?.pageInfo?.hasNextPage);
        setPageIndex(nextPageIndex);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Không thể tải thêm thông báo.' });
    }
  }, [pageIndex, toast]);

  useEffect(() => {
    // Xử lý click bên ngoài notification
    const _onWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('#notification-page-container-list')) return;
      setActiveMenu(null);
    };
    let onWindowClick: (event: MouseEvent) => void = () => {};

    // Lắng nghe sự kiện thông báo từ server
    const onNewNotification = (data: TNotification) => {
      setNotifications((prev) => {
        const p = [...prev];
        p.pop();
        console.log('socket nhận noti: ', socket?.id);

        return [data, ...p];
      });
    };

    if (user) {
      // Lấy thông báo của người dùng
      NotificationService.getOwnNotifications({ pageIndex: 1, pageSize: 8 }).then((res) => {
        if (res) {
          setNotifications(res.data);
          setHasNextPage(res?.pageInfo?.hasNextPage);
          setPageIndex(1);
        }
      });
      onWindowClick = _onWindowClick;

      if (socket?.connected) {
        // Đăng ký lắng nghe sự kiện
        onEvent(ENotificationEvent.POST_NEW_COMMENT, onNewNotification);
        onEvent(ENotificationEvent.POST_NEW, onNewNotification);
      }
      // Cleanup function
      return () => {
        document.removeEventListener('click', onWindowClick, { capture: true });
        offEvent(ENotificationEvent.POST_NEW_COMMENT, onNewNotification);
        offEvent(ENotificationEvent.POST_NEW, onNewNotification);
      };
    }

    document.addEventListener('click', onWindowClick, { capture: true });
    return () => {
      document.removeEventListener('click', onWindowClick, { capture: true });
    };
  }, [onEvent, offEvent, user, socket]);

  if (!user) {
    return <></>;
  }

  return (
    <div className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      <ProtectedRoute setAuth={setAuth} />
      {!auth && <p>Đang xác thực ...</p>}
      {auth && user && (
        <div className='mt-2'>
          <h1 className='text-foreground'>Thông báo</h1>
          <hr />
          <div className='px-2 py-1 flex justify-end border-b'>
            <Button onClick={markAllAsRead} className='px-1 text-xs' variant='outline'>
              Đánh dấu tất cả đã đọc
            </Button>
          </div>
          <div data-role='notification-list' id='notification-page-container-list'>
            {notifications.length > 0 ? (
              notifications.map((notification, i) => (
                <Notification
                  className='py-3'
                  lineClamp={3}
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
          <div className='px-2 mt-4 flex justify-center'>
            {hasNextPage ? (
              <Button
                onClick={loadMoreNotifications}
                className='px-1 w-1/2 text-xs text-foreground'
                variant='default'
              >
                Xem thêm
              </Button>
            ) : (
              <Button
                className='px-1 w-1/2 text-xs text-foreground'
                variant='secondary'
                disabled
              >
                Đã hết thông báo
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationPage;
