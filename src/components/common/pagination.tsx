'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PaginationNext, PaginationPrevious } from '../ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

export type PaginationProps = {
  // Tổng số trang
  totalPage: number;

  // Trang hiện tại (optional, nếu không có sẽ lấy từ URL)
  currentPage?: number;

  // Callback function khi trang thay đổi (optional)
  onPageChange?: (page: number) => void;

  // Trạng thái disabled của pagination (ví dụ: khi đang loading)
  disabled?: boolean;

  // Custom CSS classes
  className?: string;

  // Tên parameter trong URL (mặc định là 'pageIndex')
  paramName?: string;

  // Có giữ lại các query params khác trong URL không
  preserveQuery?: boolean;
};

function Pagination({
  totalPage,
  currentPage: propCurrentPage,
  onPageChange,
  disabled = false,
  className = '',
  paramName = 'pageIndex',
  preserveQuery = true,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lấy trang hiện tại từ URL hoặc từ props, mặc định là 1
  const currentPage = propCurrentPage ?? parseInt(searchParams.get(paramName) || '1');
  const [pageIndex, setPageIndex] = useState<number>(currentPage);

  // Hàm mặc định để xử lý thay đổi trang
  const defaultHandlePageChange = (newPage: number) => {
    const params = new URLSearchParams(preserveQuery ? searchParams.toString() : '');
    params.set(paramName, newPage.toString());
    router.push(`?${params.toString()}`);
  };

  // Sử dụng onPageChange từ props nếu có, ngược lại sử dụng hàm mặc định
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      defaultHandlePageChange(newPage);
    }
  };

  useEffect(() => {
    setPageIndex(currentPage);
  }, [currentPage]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!disabled && pageIndex >= 1 && pageIndex <= totalPage) {
      handlePageChange(pageIndex);
    }
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!disabled && currentPage < totalPage) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <form className={`inline-flex gap-2 items-center ${className}`} onSubmit={handleSubmit}>
      <PaginationPrevious
        href='#'
        onClick={handlePrevious}
        className={disabled || currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}
      />

      <Input
        className='max-w-10 h-8 text-right'
        value={pageIndex}
        type='number'
        onChange={(e) => setPageIndex(Number(e.target.value))}
        min={totalPage === 0 ? 0 : 1}
        max={totalPage}
        disabled={disabled}
      />

      <span>/ {totalPage}</span>

      <Button variant={'link'} type='submit' className='max-w-10 h-8' disabled={disabled}>
        Go
      </Button>

      <PaginationNext
        href='#'
        onClick={handleNext}
        className={disabled || currentPage >= totalPage ? 'opacity-50 cursor-not-allowed' : ''}
      />
    </form>
  );
}

export default Pagination;
