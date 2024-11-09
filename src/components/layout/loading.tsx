'use client';
import { cn } from '@/lib/utils';
import { useLoadingStore } from '@/stores/loading.store';
import React from 'react';

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingOverlay = ({ size = 24, className, ...props }: ISVGProps) => {
  const isLoading = useLoadingStore((s) => s.isLoading);
  return (
    <React.Fragment>
      {
        <div
          className={cn(
            'fixed inset-0 bg-black bg-opacity-60 z-[10000] justify-center items-center min-h-full min-w-full',
            { flex: isLoading, hidden: !isLoading }
          )}
        >
          <div className='inline-flex flex-col justify-center'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width={size}
              height={size}
              {...props}
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className={cn('animate-spin', className)}
            >
              <path d='M21 12a9 9 0 1 1-6.219-8.56' />
            </svg>
            <p className='text-white'>Đang xử lý...</p>
          </div>
        </div>
      }
    </React.Fragment>
  );
};
