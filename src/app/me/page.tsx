'use client';
import { IUser } from '@/models/user.model';
import { ROUTE } from '@/routes/routes';
import { API } from '@/services/api';
import { UserService } from '@/services/user/user.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import userImage from '@/assets/default_avt.png';
import { Button } from '@/components/ui/button';
import { PenIcon } from 'lucide-react';
import UpdateMeForm from './updateMeForm';
import { formatDate } from 'date-fns';
import { TPost } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import PostCard from '@/components/post/post-card';

function MePage() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [meProfile, setMeProfile] = useState<IUser | null>();
  const [posts, setPosts] = useState<TPost[]>([]);
  const [error, setError] = useState('');
  useEffect(() => {
    UserService.getMe()
      .then(({ data, message }) => {
        setMeProfile(data ?? null);
        setError(message ?? '');
        PostService.getOwnPosts()
          .then((posts) => {
            setPosts(posts);
          })
          .catch(() => {});
      })
      .catch((err) => {
        setError(getApiErrorMessage(err));
        setMeProfile(null);
      });
  }, []);
  if (meProfile === null) {
    return (
      <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
        <p>{error ?? 'CANNOT GET YOUR PROFILE! Try again later.'}</p>
        <a href={ROUTE.HOME}>Home</a>
      </main>
    );
  }
  if (meProfile === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      <div className='flex gap-4 flex-wrap'>
        <div>
          <Image
            className='rounded-sm'
            src={meProfile.avatarUrl ?? userImage}
            alt={meProfile.name}
            quality={80}
            height={140}
            style={{ height: 140, aspectRatio: 1 / 1, objectFit: 'contain' }}
          />
        </div>
        <div className='flex-1 relative'>
          <h3>{meProfile.name}</h3>
          <p>
            <small>
              {meProfile.dob
                ? formatDate(new Date(meProfile.dob * 1000), 'dd/MM/yyyy')
                : 'Chưa có ngày sinh'}
            </small>
          </p>
          <p>
            <small>
              {meProfile.email ? (
                <a className='text-primary' href={`mailto: ${meProfile.email}`} target='_blank'>
                  {meProfile.email}
                </a>
              ) : (
                'Chưa có email'
              )}
            </small>
          </p>
          <p title={meProfile.description} className='mt-4'>
            <small>
              <i className='break-all text-overflow-max-line-4'>
                {meProfile.description ?? 'Chưa có mô tả'}
              </i>
            </small>
          </p>
          <div className='absolute right-0 top-0 p-2'>
            <Button
              title='Chỉnh sửa thông tin'
              className='h-6 p-2'
              variant='secondary'
              onClick={() => setIsOpenForm(true)}
            >
              <PenIcon />
            </Button>
            {isOpenForm && (
              <UpdateMeForm user={meProfile} onClose={() => setIsOpenForm(false)} />
            )}
          </div>
        </div>
      </div>
      <p className='border-t border-cyan-950 my-6'></p>
      <div className='flex flex-wrap'>
        <h4>Bài viết nổi bật</h4>
        <ul className='mt-2 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 justify-items-center items-center'>
          {posts.map((post, i) => (
            <li className='max-w-[300px] w-full h-full' key={i}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}

export default MePage;
