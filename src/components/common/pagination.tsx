'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PaginationNext, PaginationPrevious } from '../ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export type PaginationProps = {
  totalPage: number;
};

function Pagination({ totalPage }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy pageIndex hiện tại từ URL params (mặc định là 1 nếu không có)
  const paramPageIndex = parseInt(searchParams.get('pageIndex') || '1');

  const [pageIndex, setPageIndex] = useState<number>(paramPageIndex);

  // Hàm để tạo URL với pageIndex mới
  const generateHref = (newPageIndex: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('pageIndex', newPageIndex.toString());
    return `?${params.toString()}`;
  };

  // Hàm xử lý submit form
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); // Ngăn chặn reload trang
    router.push(generateHref(pageIndex));
  };

  useEffect(() => {
    setPageIndex(paramPageIndex);
  }, [paramPageIndex]);

  return (
    <form className='flex gap-2 items-center' onSubmit={handleSubmit}>
      {/* Nút Previous, giảm pageIndex và tạo href cho trang trước */}
      <PaginationPrevious
        href={pageIndex > 1 ? generateHref(Math.max(pageIndex - 1, 1)) : '#'}
      />

      {/* Input để nhập pageIndex */}
      <Input
        className='max-w-10 h-8 text-right'
        value={pageIndex}
        type='number'
        onChange={(e) => setPageIndex(Number(e.target.value))}
        min={totalPage === 0 ? 0 : 1}
        max={totalPage}
      />

      <span>/ {totalPage}</span>

      {/* Nút Go có href tương ứng với pageIndex */}
      <Button variant={'link'} type='submit' className='max-w-10 h-8'>
        Go
      </Button>

      {/* Nút Next, tăng pageIndex và tạo href cho trang tiếp theo */}
      <PaginationNext
        href={pageIndex < totalPage ? generateHref(Math.min(pageIndex + 1, 120)) : '#'}
      />
    </form>
  );
}

export default Pagination;
