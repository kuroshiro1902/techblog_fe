'use client';
import { ROUTE } from '@/routes/routes';
import useAuthStore from '@/stores/auth.store';
import Link, { LinkProps } from 'next/link';
import * as React from 'react';
import defaultAvatar from '@/assets/default_avt.png';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import { useLoadingStore } from '@/stores/loading.store';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth/auth.service';

export type IHeaderTab = {
  title?: React.ReactNode;
  href?: string;
  description?: string;
  children?: {
    title?: string;
    href?: string;
    description?: string;
    // Thay thế cho hành động mặc định của thẻ a
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  }[];
};

const items: IHeaderTab[] = [
  { title: 'Trang chủ', href: ROUTE.HOME },
  {
    title: 'Danh mục',
    children: [
      {
        title: 'Bài viết nổi bật',
        description: 'Các bài viết được nhiều lượt xem nhất trong tháng.',
        href: '/hot',
      },
      {
        title: 'Tác giả nổi bật',
        description: 'Các tác giả được đánh giá cao.',
        href: '/best-author',
      },
      { title: 'Học tập', href: '/learn' },
    ],
  },
];

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, href = '#', ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            href={href}
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            onClick={async (e) => {
              if (props.onClick) {
                props.onClick(e);
                if (!href || href === '#') {
                  e.preventDefault();
                }
                window.location.reload();
              }
            }}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);

ListItem.displayName = 'ListItem';

const HeaderMenu = ({
  items = [],
  contentPosition = 'left',
}: {
  items: IHeaderTab[];
  contentPosition?: 'left' | 'right';
}) => {
  return (
    <NavigationMenu contentPosition={contentPosition}>
      <NavigationMenuList>
        {items.map((item, index) => {
          if (item.children && item.children.length > 0) {
            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuTrigger className='h-12'>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className='grid max-w-max gap-3 p-4 md:w-[240px] md:grid-cols-1 '>
                    {item.children.map((subitem, i) => (
                      <ListItem
                        key={i}
                        title={subitem.title}
                        href={subitem.href}
                        onClick={subitem.onClick}
                      >
                        {subitem.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          } else {
            return (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  asChild
                  className={cn(navigationMenuTriggerStyle(), 'h-12')}
                >
                  <Link href={item.href ?? '#'}>{item.title}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          }
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function Header() {
  const { user, setUser } = useAuthStore();
  React.useEffect(() => {
    console.log({ user });
  }, [user?.id]);
  const router = useRouter();
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const handleLogout = async () => {
    console.log('logout');
    await executeWithLoading(async () => {
      AuthService.deleteToken();
      setUser(undefined);
      setTimeout(() => {
        router.refresh();
      }, 100);
    });
  };
  return (
    <React.Fragment>
      <header
        id='header'
        className='bg-background max-w-full justify-between flex px-4 py-2 fixed top-0 inset-x-0 z-[9998]'
      >
        <HeaderMenu
          items={[
            {
              title: (
                <Image
                  src='/logo1.png'
                  alt=''
                  style={{ width: 48, height: 48 }}
                  width={480}
                  height={480}
                  quality={95}
                  className='rounded-full'
                />
              ),
              href: ROUTE.HOME,
            },
          ]}
        />
        <HeaderMenu items={items} />
        {user?.id && (
          <HeaderMenu
            contentPosition='right'
            items={[
              {
                title: (
                  <>
                    <Image
                      src={user.avatarUrl ?? defaultAvatar}
                      alt={user.name ?? "User's avatar"}
                      width={24}
                      quality={40}
                      className='rounded-full'
                    />
                    <span className='ml-2'>Xin chào, {user.name.split(' ').pop()}</span>
                  </>
                ),
                children: [
                  { title: 'Trang cá nhân', href: '#' + user.id },
                  { title: 'Viết bài', href: '/post/create' },
                  {
                    title: 'Bài viết yêu thích',
                    href: '#',
                    description: 'Những bài viết bạn đã yêu thích.',
                  },
                  { title: 'Đăng xuất', onClick: handleLogout },
                ],
              },
            ]}
          />
        )}
        {!user?.id && (
          <HeaderMenu
            contentPosition='right'
            items={[
              { title: 'Đăng nhập', href: ROUTE.LOGIN },
              { title: 'Đăng ký', href: ROUTE.SIGNUP },
            ]}
          />
        )}
      </header>
      <div className='pt-[70px]'></div>
    </React.Fragment>
  );
}

export default Header;
