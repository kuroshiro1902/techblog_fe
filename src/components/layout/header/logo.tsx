import Image from 'next/image';
import Link from 'next/link';
import { ROUTE } from '@/routes/routes';
import { BotIcon, BugIcon } from 'lucide-react';

export function Logo() {
  return (
    <Link
      href={ROUTE.HOME}
      className='flex items-center gap-2 font-mono !font-bold text-2xl text-primary'
    >
      {/* <Image
        src='/logo1.png'
        alt='Logo'
        width={48}
        height={48}
        quality={95}
        className='rounded-full'
      /> */}
      <i>TECH</i>
      <BotIcon />
    </Link>
  );
}
