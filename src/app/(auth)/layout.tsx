'use client';

import { Logo } from '@/components/layout/logo';
import { ROUTE } from '@/routes/routes';
import { AuthService } from '@/services/auth/auth.service';
import useAuthStore from '@/stores/auth.store';
import { BotIcon } from 'lucide-react';
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
  }, [user?.id, router, searchParams]);
  return (
    <div className='max-w-screen-lg m-auto py-2'>
      <h1 className='text-linear-primary font flex items-center gap-2'>
        <BotIcon className='inline text-inherit text-primary' size={40} />
        <span>Chào mừng bạn đến với TechBlog</span>
      </h1>
      <div className='flex-col place-items-center bg-primary my-4 p-4 text-background relative'>
        <div
          className='absolute inset-0 z-10 opacity-20'
          style={{ backgroundImage: 'url(/img3.webp)', backgroundPosition: 'center' }}
        ></div>
        <Logo className='text-inherit text-4xl' />
        <h4>Nền tảng chia sẻ kiến thức công nghệ trực tuyến!</h4>
      </div>
      {loading && <h3>Đang xác thực người dùng...</h3>}
      {!loading && children}
    </div>
  );
}

export default AuthPage;
