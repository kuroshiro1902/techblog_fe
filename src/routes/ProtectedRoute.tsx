'use client';

import { AuthService } from '@/services/auth/auth.service';
import { useRouter } from 'next/navigation';
import { Dispatch, Fragment, SetStateAction, useEffect } from 'react';
import { ROUTE } from './routes';
import { useLoadingStore } from '@/stores/loading.store';
import useAuthStore from '@/stores/auth.store';

interface ProtectedRouteProps {
  setAuth?: Dispatch<SetStateAction<boolean>>;
}

function ProtectedRoute({ setAuth }: ProtectedRouteProps) {
  console.log('protectedRoute');

  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  useEffect(() => {
    console.log('execute authentication');
    const auth = async () => {
      return await executeWithLoading(async () => {
        if (!AuthService.getToken()) {
          router.replace(
            ROUTE.LOGIN + `?redirect=${encodeURIComponent(window.location.pathname)}`
          );
        } else {
          setAuth?.(true);
        }
      });
    };
    auth();
    return () => setAuth?.(false);
  }, [router, user]);
  return <Fragment />;
}

export default ProtectedRoute;
