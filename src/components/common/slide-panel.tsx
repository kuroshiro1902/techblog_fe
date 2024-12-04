'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: string;
}

export function SlidePanel({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = '600px',
}: SlidePanelProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-background/50 z-50 transition-opacity',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full bg-background shadow-xl z-[9999] transition-transform duration-300 transform',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ width }}
      >
        <div className='h-full flex flex-col'>
          {/* Header */}
          <div className='p-4 border-b flex justify-between items-center'>
            <h3 className='text-lg font-semibold'>{title}</h3>
            <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto p-6'>{children}</div>

          {/* Footer */}
          {footer && <div className='p-4 border-t'>{footer}</div>}
        </div>
      </div>
    </>
  );
}
