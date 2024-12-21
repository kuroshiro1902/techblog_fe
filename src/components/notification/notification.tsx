import React, { forwardRef, HTMLAttributes } from 'react';
import { TNotification } from '@/models/notification.model';
import s from './notification.module.scss';
import { Button } from '../ui/button';
import { MoreHorizontalIcon } from 'lucide-react';
import { formatDate } from 'date-fns';

interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  notification: TNotification;
  markAsRead: (notificationId: number) => Promise<void>;
  toggleMenu: (notificationId: number) => void;
  activeMenu: number | null;
  unsubscribeFromPost: (postId: number) => Promise<void>;
  lineClamp?: number;
}

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
  (
    {
      notification,
      markAsRead,
      toggleMenu,
      activeMenu,
      unsubscribeFromPost,
      className,
      lineClamp,
      ...rest
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        data-role='notification-item'
        key={notification.id}
        className={`block px-4 py-2 border-b ${
          notification.read ? '' : 'bg-primary'
        } relative ${className || ''}`}
        {...rest} // Truyền các thuộc tính bổ sung vào đây
      >
        <a
          className='block hover:underline'
          target='_blank'
          href={
            notification.itemType === 'post' ? `/post/detail/${notification.post.slug}` : '#'
          }
        >
          {notification.createdAt && (
            <time
              className={`text-xs ${
                notification.read ? 'text-foreground/70' : 'text-secondary/70'
              }`}
            >
              {formatDate(notification.createdAt, 'HH:mm dd/MM/yyyy')}
            </time>
          )}
          <div
            onClick={() => markAsRead(notification.id)}
            className={`${s.notificationContent} text-ellipsis line-clamp-${
              lineClamp ?? 2
            } text-sm ${!notification.read ? 'text-secondary' : ''}`}
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
                disabled={notification.read}
              >
                Đánh dấu đã đọc
              </Button>
              <Button
                variant='link'
                className='w-full text-left px-3 py-2 text-sm text-red-500'
                // disabled={notification.itemType === 'post'}
                onClick={(e) =>
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
    );
  }
);

Notification.displayName = 'Notification';

export default Notification;
