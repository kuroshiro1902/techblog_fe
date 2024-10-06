'use client';

import { ROUTE } from '@/routes/routes';
import { AuthService } from '@/services/auth/auth.service';
import useAuthStore from '@/stores/auth.store';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function AuthPage({ children }: any) {
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(() => {
    if (user && AuthService.getToken()) {
      const redirectUrl = searchParams.get('redirect') || ROUTE.HOME;
      router.replace(redirectUrl);
    } else {
      setLoading(false);
    }

    return () => setLoading(true);
  }, [user?.id]);
  return (
    <div className='max-w-screen-lg m-auto'>
      <h1 className='text-primary font'>Chào mừng bạn đến với Techblog</h1>
      {loading && <h3>Đang xác thực người dùng...</h3>}
      {!loading && children}
    </div>
  );
}

export default AuthPage;
