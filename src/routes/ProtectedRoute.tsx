'use client';

import { AuthService } from '@/services/auth/auth.service';
import { useRouter } from 'next/navigation';
import { Dispatch, Fragment, SetStateAction, useEffect } from 'react';
import { ROUTE } from './routes';

interface ProtectedRouteProps {
  setAuth?: Dispatch<SetStateAction<boolean>>;
}

function ProtectedRoute({ setAuth }: ProtectedRouteProps) {
  console.log('protectedRoute');

  const router = useRouter();
  useEffect(() => {
    if (!AuthService.getToken()) {
      router.replace(
        ROUTE.LOGIN +
          `?redirect=${encodeURIComponent(window.location.pathname)}`
      );
    } else {
      setAuth?.(true);
    }
    return () => setAuth?.(false);
  }, [router]);
  return <Fragment />;
}

export default ProtectedRoute;
