'use client';
import * as React from 'react';
import { ROUTE } from '@/routes/routes';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Logo } from './logo';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import NotificationList from './notification-list';

function Header() {
  return (
    <React.Fragment>
      <header className='bg-background fixed top-0 inset-x-0 z-[9998] shadow-lg shadow-popover'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <Logo />
          <MainNav />
          <div className='flex items-center gap-2'>
            <NotificationList />
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </header>
      <div className='h-16' />
    </React.Fragment>
  );
}

export default Header;
