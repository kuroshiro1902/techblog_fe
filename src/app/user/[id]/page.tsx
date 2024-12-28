'use server';

import { Button } from '@/components/ui/button';
import { IUser } from '@/models/user.model';
import { UserService } from '@/services/user/user.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import userImage from '@/assets/default_avt.png';
import { formatDate } from 'date-fns';
import NavigateToMe from './components/navigateToMe';
import PostSection from '@/app/me/components/post-section';
import { PostService } from '@/services/post/post.service';
import { UserPlusIcon } from 'lucide-react';
import { FollowButton } from './components/follow-button';

const UserCard = ({ user }: { user: IUser }) => {
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

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const { data: user } = await UserService.getUserProfile(+params.id);
    if (!user) {
      throw new Error('Không tìm thấy người dùng.');
    }
    return {
      title: 'Tech Blog - ' + user.name,
      description: user.description?.substring(0, 160).replace(/<[^>]*>/g, ''),
      openGraph: {
        title: 'Tech Blog - ' + user.name,
        description: user.description?.substring(0, 160).replace(/<[^>]*>/g, ''),
        images: user.avatarUrl ? [user.avatarUrl] : [],
        type: 'profile',
        emails: user.email,
      },
      alternates: {
        canonical: `/user/${user.id}`,
      },
    };
  } catch {
    return {
      title: 'Người dùng không tồn tại',
      description: 'Không tìm thấy người dùng này',
    };
  }
}

async function UserDetailPage({ params }: { params: { id: string } }) {
  try {
    const { data: user } = await UserService.getUserProfile(+params.id);
    const [followerRes, followingRes] = await Promise.allSettled([
      UserService.getFollowers(+params.id),
      UserService.getFollowing(+params.id),
    ]);

    const followers = followerRes.status === 'fulfilled' ? followerRes.value.data : [];

    const following = followingRes.status === 'fulfilled' ? followingRes.value.data : [];

    if (!user) {
      throw new Error('Không tìm thấy thấy thông tin người dùng!');
    }
    const fetchOwnPosts = async (page: number, pageSize: number) => {
      'use server';
      const response = await PostService.filterPosts({
        pageIndex: page,
        pageSize,
        authorId: user.id,
      });

      return {
        data: response.data,
        currentPage: response.pageInfo.pageIndex,
        pageSize: response.pageInfo.pageSize,
        totalPages: response.pageInfo.totalPage,
      };
    };
    return (
      <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
        <NavigateToMe userId={user.id} />
        <div className='flex gap-4 flex-wrap'>
          <div>
            <Image
              className='rounded-sm'
              src={user.avatarUrl ?? userImage}
              alt={user.name}
              quality={80}
              height={140}
              width={140}
              style={{ height: 140, aspectRatio: 1 / 1, objectFit: 'contain' }}
            />
          </div>
          <div className='flex-1 relative'>
            <h3>{user.name}</h3>
            <p>
              <small>
                {user.dob
                  ? formatDate(new Date(user.dob * 1000), 'dd/MM/yyyy')
                  : 'Chưa có ngày sinh'}
              </small>
            </p>
            <p>
              <small>
                {user.email ? (
                  <a className='text-primary' href={`mailto: ${user.email}`} target='_blank'>
                    {user.email}
                  </a>
                ) : (
                  'Chưa có email'
                )}
              </small>
            </p>
            <p title={user.description} className='mt-4'>
              <small>
                <i className='break-all text-overflow-max-line-4'>
                  {user.description ?? 'Chưa có mô tả'}
                </i>
              </small>
            </p>
            <div className='absolute right-0 top-0 p-2'>
              <FollowButton userId={user.id} />
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
        <PostSection title='Bài viết đã xuất bản' fetchPosts={fetchOwnPosts} />
      </main>
    );
  } catch (error: any) {
    return (
      <div className='text-center'>
        <h3 className='text-red-500 mb-4'>
          Lỗi tải thông tin người dùng: {getApiErrorMessage(error)}
        </h3>
        <Link href={'/'}>
          <Button variant={'destructive'}>Quay lại trang chủ</Button>
        </Link>
      </div>
    );
  }
}
export default UserDetailPage;
