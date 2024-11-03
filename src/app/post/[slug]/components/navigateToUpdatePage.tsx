'use client';

import { Button } from '@/components/ui/button';
import useAuthStore from '@/stores/auth.store';
import Link from 'next/link';
import React from 'react';

interface props {
  authorId: number;
  postSlug?: string;
}
function NavigateToUpdatePage({ authorId, postSlug }: props) {
  const user = useAuthStore((s) => s.user);
  if (user?.id !== authorId) {
    return <React.Fragment />;
  }
  return (
    <div className='flex justify-end'>
      <Link href={'/post/update/' + postSlug}>
        <Button variant='link'>Chỉnh sửa bài viết</Button>
      </Link>
    </div>
  );
}

export default NavigateToUpdatePage;
