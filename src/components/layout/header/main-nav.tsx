import Link from 'next/link';
import { ROUTE } from '@/routes/routes';
import { Dropdown } from '@/components/common/dropdown';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const mainNavItems = [
  { title: 'Trang chủ', href: ROUTE.HOME },
  {
    title: 'Danh mục',
    items: [
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

export function MainNav() {
  return (
    <nav className='flex items-center gap-1 min-[360px]:gap-2'>
      {mainNavItems.map((item, index) => (
        <div key={index}>
          {item.items ? (
            <Dropdown
              trigger={
                <Button
                  variant='ghost'
                  className='flex items-center gap-1 min-[360px]:px-4 px-2'
                >
                  {item.title}
                  <ChevronDown className='h-4 w-4' />
                </Button>
              }
            >
              <div className='py-1'>
                {item.items.map((subItem, i) => (
                  <Link
                    key={i}
                    href={subItem.href || '#'}
                    className='block py-2 text-sm hover:bg-accent min-[360px]:px-4 px-2'
                  >
                    <div>{subItem.title}</div>
                    {subItem.description && (
                      <p className='text-xs text-muted-foreground'>{subItem.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </Dropdown>
          ) : (
            <Link href={item.href || '#'}>
              <Button className='min-[360px]:px-4 px-2' variant='ghost'>
                {item.title}
              </Button>
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
