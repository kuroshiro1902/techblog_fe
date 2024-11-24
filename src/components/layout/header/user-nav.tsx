import { useLoadingStore } from '@/stores/loading.store';
import { AuthService } from '@/services/auth/auth.service';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/routes/routes';
import { Dropdown } from '@/components/common/dropdown';
import Image from 'next/image';
import defaultAvatar from '@/assets/default_avt.png';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import useAuthStore from '@/stores/auth.store';
import { ChevronDown } from 'lucide-react';

export function UserNav() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);

  const handleLogout = async () => {
    await executeWithLoading(async () => {
      AuthService.deleteToken();
      setUser(undefined);
      router.refresh();
    });
  };

  if (!user?.id) {
    return (
      <div className='flex items-center gap-2'>
        <Link href={ROUTE.LOGIN}>
          <Button variant='ghost'>Đăng nhập</Button>
        </Link>
        <Link href={ROUTE.SIGNUP}>
          <Button variant='ghost'>Đăng ký</Button>
        </Link>
      </div>
    );
  }

  return (
    <Dropdown
      trigger={
        <Button variant='ghost' className='flex items-center gap-2'>
          <Image
            src={user.avatarUrl ?? defaultAvatar}
            alt={user.name ?? "User's avatar"}
            width={24}
            height={24}
            quality={40}
            className='rounded-full'
          />
          <span className='hidden min-[360px]:inline'>
            Xin chào, {user.name.split(' ').pop()}
          </span>
          <ChevronDown className='h-4 w-4' />
        </Button>
      }
      align='right'
    >
      <div className='py-1'>
        <Link href={ROUTE.ME} className='block px-4 py-2 text-sm hover:bg-accent'>
          Trang cá nhân
        </Link>
        <Link href='/post/create' className='block px-4 py-2 text-sm hover:bg-accent'>
          Viết bài
        </Link>
        <button
          onClick={handleLogout}
          className='block w-full text-left px-4 py-2 text-sm hover:bg-accent'
        >
          Đăng xuất
        </button>
      </div>
    </Dropdown>
  );
}
