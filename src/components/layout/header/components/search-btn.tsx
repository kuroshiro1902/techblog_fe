import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useRef, useState } from 'react';

export const SearchBtn = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    const search = e.target.search?.value?.trim();
    if (search) {
      window.location.href = `/post?search=${encodeURIComponent(search)}`;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // Kiểm tra nếu click ngoài modal và button
      if (modalRef.current && !modalRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Thêm sự kiện click vào window
    window.addEventListener('click', handleClickOutside);

    // Cleanup sự kiện khi component bị unmount
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <Button
        variant='ghost'
        onClick={(e) => {
          e.stopPropagation(); // Ngăn sự kiện click lan ra ngoài
          setIsOpen(!isOpen);
        }}
        title='Tìm kiếm'
      >
        <span role='img' aria-label='search'>
          <Search size={16} />
        </span>
      </Button>
      {isOpen && (
        <div
          ref={modalRef}
          className='absolute top-full left-0 p-2 bg-background rounded z-10000'
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <form className='flex-col place-items-end' onSubmit={handleSearchSubmit}>
            <Input
              required
              type='text'
              maxLength={200}
              name='search'
              placeholder='Nhập từ khóa tìm kiếm...'
              className='w-[200px] p-1'
            />
            <Button className='mt-2' variant='secondary'>
              Tìm kiếm
            </Button>
          </form>
        </div>
      )}
    </div>
  );
});
SearchBtn.displayName = 'SearchBtn';
