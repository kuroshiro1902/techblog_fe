'use client';
import { ArrowUpIcon } from 'lucide-react';
import { Button } from '../ui/button';

function ScrollToTop() {
  return (
    <Button
      variant='outline'
      title='Lên đầu trang'
      className='fixed bottom-4 right-4 z-50'
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUpIcon />
    </Button>
  );
}

export default ScrollToTop;
