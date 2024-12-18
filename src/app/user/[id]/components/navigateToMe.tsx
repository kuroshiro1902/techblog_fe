'use client';

import useAuthStore from '@/stores/auth.store';
import { useLoadingStore } from '@/stores/loading.store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function NavigateToMe({ userId }: { userId?: number }) {
  const setIsLoading = useLoadingStore((s) => s.setIsLoading);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  useEffect(() => {
    if (user?.id && user?.id === userId) {
      setIsLoading(true);
      router.replace('/me');
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [user?.id, userId]);
  return <span data-role='router'></span>;
}

export default NavigateToMe;
