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

const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
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
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] '>
                  {components.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href='/docs' legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Documentation
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu contentPosition='right'>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>
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
                <ul className='grid gap-1 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
                  <li className='row-span-4'>
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
