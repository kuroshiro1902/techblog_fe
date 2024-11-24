import Image from 'next/image';
import Link from 'next/link';
import { ROUTE } from '@/routes/routes';

export function Logo() {
  return (
    <Link href={ROUTE.HOME} className='flex items-center'>
      <Image
        src='/logo1.png'
        alt='Logo'
        width={48}
        height={48}
        quality={95}
        className='rounded-full'
      />
    </Link>
  );
}
