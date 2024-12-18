import Image from 'next/image';
import Link from 'next/link';
import { ROUTE } from '@/routes/routes';
import { BotIcon, BugIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, iconSize }: { className?: string; iconSize?: number }) {
  return (
    <Link
      href={ROUTE.HOME}
      className={cn(
        'flex items-center gap-2 font-mono !font-bold text-2xl text-primary',
        className
      )}
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
      <BotIcon size={iconSize} />
    </Link>
  );
}
