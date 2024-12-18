'use client';

import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { ROUTE } from '@/routes/routes';
import useAuthStore from '@/stores/auth.store';
import { ArrowRightCircleIcon } from 'lucide-react';

function Greeting() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className='max-w-screen-md m-auto z-[1]'>
      <p className='text-5xl font-semibold'>
        Chào mừng {user?.name ? <b className='text-linear-primary'>{user.name}</b> : 'bạn'} đến
        với <Logo className='inline-flex text-5xl' iconSize={48} />!
      </p>
      <p className='text-lg py-4 my-4 max-w-screen-md'>
        Nơi kết nối các lập trình viên, chia sẻ kiến thức, ý tưởng, và cùng nhau phát triển.
        <br />
        Khám phá, học hỏi, và đóng góp ngay hôm nay!
      </p>
    </div>
  );
}

export default Greeting;
