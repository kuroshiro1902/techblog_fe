'use client';
import { ROUTE } from '@/routes/routes';
import useAuthStore from '@/stores/auth.store';
import Link from 'next/link';
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
  title?: string;
  href?: string;
  description?: string;
  children?: { title?: string; href?: string; description?: string }[];
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

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md px-3 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
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
});

const DefaultHeader = () => {
  return (
    <div className='flex max-w-screen-lg m-auto justify-end'>
      <ul>
        <NavigationMenu>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), 'underline')}
            >
              <Link href={ROUTE.LOGIN}>Đăng nhập</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={cn(navigationMenuTriggerStyle(), 'underline')}
            >
              <Link href={ROUTE.SIGNUP}>Đăng ký</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenu>
      </ul>
    </div>
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
    executeWithLoading(async () => {
      AuthService.deleteToken();
      setUser(undefined);
      setTimeout(() => {
        router.refresh();
      }, 100);
    });
  };
  if (!user?.id) {
    return <DefaultHeader />;
  }
  return (
    <React.Fragment>
      <header
        id='header'
        className=' max-w-full justify-between flex p-4 fixed top-0 inset-x-0 z-[9998]'
      >
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href={ROUTE.HOME} legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(navigationMenuTriggerStyle(), 'h-12')}
                >
                  <Image
                    src='/logo1.png'
                    alt=''
                    style={{ width: 48, height: 48 }}
                    width={480}
                    height={480}
                    quality={95}
                    className='rounded-full'
                  />
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList>
            {items.map((item, index) => {
              if (item.children && item.children.length > 0) {
                return (
                  <NavigationMenuItem key={index}>
                    <NavigationMenuTrigger className='h-12'>
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className='grid w-[360px] gap-3 p-4 md:w-[460] md:grid-cols-2 '>
                        {item.children.map((subitem, i) => (
                          <ListItem
                            key={i}
                            title={subitem.title}
                            href={subitem.href}
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
                    <Link href={item.href ?? '#'} legacyBehavior passHref>
                      <NavigationMenuLink
                        className={cn(navigationMenuTriggerStyle(), 'h-12')}
                      >
                        {item.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                );
              }
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu contentPosition='right'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className='h-12'>
                <Image
                  src={user.avatarUrl ?? defaultAvatar}
                  alt={user.name ?? "User's avatar"}
                  width={24}
                  quality={40}
                  className='rounded-full'
                />
                <span className='ml-2'>
                  Xin chào, {user.name.split(' ').pop()}
                </span>
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid gap-1 p-4'>
                  <li className='row-span-1'>
                    <NavigationMenuLink asChild>
                      <a
                        className='relative flex items-center h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-4 no-underline outline-none focus:shadow-md'
                        href='/'
                      >
                        <Image
                          src={user.avatarUrl ?? defaultAvatar}
                          alt={user.name ?? "User's avatar"}
                          width={90}
                          quality={75}
                        />
                        <h3 className='mb-2 mt-4 text-lg font-medium truncate'>
                          {user.name}
                        </h3>
                        <p
                          title={user.description}
                          className='text-sm leading-tight text-muted-foreground max-w-[90px]'
                        >
                          {user.description?.substring(0, 72)}
                          {(user.description?.substring(0, 72).length ?? 0) >
                          (user.description?.length ?? 0)
                            ? '...'
                            : ''}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href='/docs' title='Thông tin'></ListItem>
                  <ListItem href='/docs/installation' title='Yêu thích'>
                    Những bài viết bạn đã yêu thích.
                  </ListItem>
                  <ListItem
                    href='/docs/installation'
                    title='Viết bài'
                  ></ListItem>
                  <ListItem
                    className='cursor-pointer'
                    title='Đăng xuất'
                    onClick={handleLogout}
                  ></ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <div className='pt-[70px]'></div>
    </React.Fragment>
  );
}

export default Header;
