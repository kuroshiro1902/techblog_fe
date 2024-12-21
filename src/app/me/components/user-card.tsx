import { Button } from '@/components/ui/button';
import { IUser } from '@/models/user.model';
import userImage from '@/assets/default_avt.png';
import Image from 'next/image';

export const UserCard = ({ user }: { user: IUser }) => {
  return (
    <a href={'/user/' + user.id} target='_blank'>
      <Button variant='outline' className='h-8 inline-flex p-1 gap-2 items-center'>
        <Image
          className='rounded-full'
          src={user.avatarUrl ?? userImage}
          width={20}
          height={20}
          alt={user.name}
        />
        <span>{user.name}</span>
      </Button>
    </a>
  );
};
