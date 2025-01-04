'use client';
import { IUser } from '@/models/user.model';
import { ROUTE } from '@/routes/routes';
import { API } from '@/services/api';
import { UserService } from '@/services/user/user.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import userImage from '@/assets/default_avt.png';
import { Button } from '@/components/ui/button';
import { LockKeyholeIcon, PenIcon } from 'lucide-react';
import UpdateMeForm from './components/updateMeForm';
import { formatDate } from 'date-fns';
import { TPost } from '@/models/post.model';
import PostSection from './components/post-section';
import UpdatePasswordForm from './components/updatePasswordForm';
import RatingHistory from './components/ratings-history';
import CommentHistory from './components/comments-history';
import { PostService } from '@/services/post/post.service';
import { UserCard } from './components/user-card';
import useAuthStore from '@/stores/auth.store';
import Link from 'next/link';

function MePage() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenPasswordForm, setIsOpenPasswordForm] = useState(false);
  const [meProfile, setMeProfile] = useState<IUser | null>();
  const user = useAuthStore((s) => s.user);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [following, setFollowing] = useState<IUser[]>([]);
  const [error, setError] = useState('');
  const fetchOwnPosts = useCallback(
    async (isPublished: boolean, page: number, pageSize: number) => {
      const response = await PostService.getOwnPosts({
        pageIndex: page,
        pageSize,
        isPublished,
      });

      return {
        data: response.data,
        currentPage: response.pageInfo.pageIndex,
        pageSize: response.pageInfo.pageSize,
        totalPages: response.pageInfo.totalPage,
      };
    },
    []
  );
  const fetchFavoritePosts = useCallback(async (page: number, pageSize: number) => {
    const response = await PostService.getFavoritePosts({
      pageIndex: page,
      pageSize,
    });

    return {
      data: response.data,
      currentPage: response.pageInfo.pageIndex,
      pageSize: response.pageInfo.pageSize,
      totalPages: response.pageInfo.totalPage,
    };
  }, []);
  useEffect(() => {
    if (!user?.id) {
      setError('Vui lòng đăng nhập để thực hiện chức năng này!');
      setMeProfile(null);
      return;
    }
    UserService.getMe()
      .then(({ data, message }) => {
        setMeProfile(data ?? null);
        setError(message ?? '');
        if (data) {
          Promise.allSettled([
            UserService.getFollowers(data.id),
            UserService.getFollowing(data.id),
          ]).then(([followerRes, followingRes]) => {
            const followers = followerRes.status === 'fulfilled' ? followerRes.value.data : [];
            const following =
              followingRes.status === 'fulfilled' ? followingRes.value.data : [];
            setFollowers(followers ?? []);
            setFollowing(following ?? []);
          });
        }
      })
      .catch((err) => {
        setError(getApiErrorMessage(err));
        setMeProfile(null);
      });
  }, [user?.id]);
  if (meProfile === null) {
    return (
      <main className='max-w-screen-lg m-auto lg:p-8 p-4'>
        <title>Tech Blog - Trang cá nhân</title>
        <p>{error ?? 'CANNOT GET YOUR PROFILE! Try again later.'}</p>
        <Link href={ROUTE.LOGIN} className='mt-2 inline-block'>
          <Button variant='outline'>Đăng nhập</Button>
        </Link>
      </main>
    );
  }
  if (meProfile === undefined) {
    return (
      <div>
        Loading... <title>Tech Blog - Trang cá nhân</title>
      </div>
    );
  }
  return (
    <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      <title>Tech Blog - Trang cá nhân</title>
      <div className='flex gap-4 flex-wrap'>
        <div>
          <Image
            className='rounded-sm'
            src={meProfile.avatarUrl ?? userImage}
            alt={meProfile.name}
            quality={80}
            height={140}
            width={140}
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
              title='Đổi mật khẩu'
              className='h-6 p-2 mr-2'
              variant='secondary'
              onClick={() => setIsOpenPasswordForm(true)}
            >
              <LockKeyholeIcon />
            </Button>
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
            {isOpenPasswordForm && (
              <UpdatePasswordForm onClose={() => setIsOpenPasswordForm(false)} />
            )}
          </div>
        </div>
      </div>
      <div className='border-t border-cyan-950 my-6' />
      <div className='flex gap-2 flex-wrap' role='list' data-role='followers'>
        <div className='flex-1 max-h-40 overflow-y-auto'>
          <h6>Người theo dõi</h6>
          {followers?.map((u, i) => (
            <UserCard key={i} user={u} />
          ))}
        </div>
        <div className='flex-1 max-h-40 overflow-y-auto'>
          <h6>Người đang theo dõi</h6>
          {following?.map((u, i) => (
            <UserCard key={i} user={u} />
          ))}
        </div>
      </div>
      <PostSection
        title='Bài viết đã xuất bản'
        fetchPosts={(pageIndex, pageSize) => fetchOwnPosts(true, pageIndex, pageSize)}
      />
      <PostSection
        title='Bài viết chưa xuất bản'
        fetchPosts={(pageIndex, pageSize) => fetchOwnPosts(false, pageIndex, pageSize)}
      />
      <PostSection title='Bài viết yêu thích' fetchPosts={fetchFavoritePosts} />
      <RatingHistory />
      <CommentHistory />
    </main>
  );
}

export default MePage;
