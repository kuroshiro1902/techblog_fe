'use client';

import { ROUTE } from '@/routes/routes';
import { SlidePanel } from '@/components/common/slide-panel';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, MenuIcon } from 'lucide-react';
import { SearchBtn } from './components/search-btn';

const mainNavItems = [
  { title: 'Trang chủ', href: ROUTE.HOME },
  {
    title: 'Thể loại',
    items: [
      { title: 'Frontend', href: '/post?categoryId=1' },
      { title: 'Backend', href: '/post?categoryId=2' },
      { title: 'Nodejs', href: '/post?categoryId=3' },
    ],
  },
  { title: 'Bài viết', href: '/post' },
  { title: 'Bài viết mới', href: '/post?orderBy=createdAt-desc' },
  { title: 'Bài viết nổi bật', href: '/post?orderBy=views-desc' },
];

export function MainNav() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className='relative'>
      {/* Desktop Navigation */}
      <ul className='hidden md:flex items-center gap-4'>
        {mainNavItems.map((item, index) => (
          <li key={index} className='relative group'>
            {item.items ? (
              <div className='relative'>
                <Button variant='ghost' className='px-4 py-2'>
                  {item.title}
                  <ChevronDown className='h-4 w-4 ml-2' />
                </Button>
                <ul className='absolute left-0 top-full hidden group-hover:block bg-background shadow-md shadow-slate-800 min-w-32 rounded'>
                  {item.items.map((subItem, i) => (
                    <li key={i}>
                      <a href={subItem.href} className='block px-4 py-2 hover:bg-secondary'>
                        {subItem.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <a href={item.href}>
                <Button variant='ghost' className='px-4 py-2'>
                  {item.title}
                </Button>
              </a>
            )}
          </li>
        ))}
        <li className='relative group hidden lg:list-item'>
          <SearchBtn />
        </li>
      </ul>

      {/* Mobile Navigation */}
      <div className='md:hidden'>
        <Button
          onClick={() => setMobileMenuOpen(true)}
          className='py-2 px-4'
          variant='secondary'
        >
          <MenuIcon />
        </Button>

        <SlidePanel
          isOpen={isMobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          title='Menu'
          width='260px'
        >
          <ul>
            {mainNavItems.map((item, index) => (
              <li key={index} className='mb-2'>
                {item.items ? (
                  <div className='flex flex-col'>
                    <span className='block font-semibold px-4 py-2'>{item.title}</span>
                    <ul className='pl-4'>
                      {item.items.map((subItem, i) => (
                        <li key={i}>
                          <a href={subItem.href} className='block px-4 py-2 hover:bg-secondary'>
                            {subItem.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <a href={item.href} className='block px-4 py-2 hover:bg-secondary'>
                    {item.title}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </SlidePanel>
      </div>
    </nav>
  );
}
