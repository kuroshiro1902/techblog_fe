import { Button } from '@/components/ui/button';
import 'react-quill-new/dist/quill.snow.css';
import { PostService } from '@/services/post/post.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvt from '@/assets/default_avt.png';
import dayjs from 'dayjs';
import { Badge } from '@/components/ui/badge';
import NavigateToUpdatePage from './components/navigateToUpdatePage';
import Rating from './components/rating';
import { Ratings } from './components/ratings';

async function PostDetailPage({ params }: { params: { slug: string } }) {
  try {
    const post = await PostService.getDetailPost({ slug: params.slug });

    return (
      <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
        <NavigateToUpdatePage postSlug={post.slug} authorId={post.author.id} />
        <h1 className='mb-2 text-linear-primary'>{post?.title}</h1>
        <Ratings score={post.rating?.score ?? 0} />
        <div className='inline-flex items-center gap-4 text-sm'>
          <span>Thể loại: </span>
          {post.categories.length === 0 && <i>Không xác định</i>}
          {post.categories.map((category, i) => (
            <Link href={'/?category=' + category.id} key={i}>
              <Badge>{category.name}</Badge>
            </Link>
          ))}
        </div>
        <div className='py-2'></div>
        <div className='inline-flex items-center gap-4'>
          <Link
            title={post?.author.name}
            href={`/user/${post?.author?.id}`}
            target='_blank'
            className='font-bold inline-flex items-center gap-2'
          >
            <Image
              className='w-6 aspect-[1/1] rounded-full'
              src={post?.author.avatarUrl ?? defaultAvt}
              alt={post?.author.name ?? ''}
              width={24}
              height={24}
              quality={50}
            />
            <span className='underline '>{post?.author?.name?.substring(0, 30)}</span>
          </Link>
          <span>-</span>
          <time className='pt-[2px]'>
            {post?.createdAt
              ? `${dayjs(post?.createdAt).tz('Asia/Bangkok').format('HH:mm DD/MM/YYYY')}`
              : ''}
          </time>
        </div>

        <div className='p-3'></div>
        {post.thumbnailUrl && (
          <div className='image-ctn text-center relative'>
            <div
              className='absolute inset-0 z-[-2] rounded-sm'
              style={{
                backgroundImage: `url(${post.thumbnailUrl})`,
                backgroundPosition: 'center',
                filter: 'blur(10px)',
                backgroundSize: 'contain',
              }}
            ></div>
            <div
              className='absolute inset-0 z-[-1] rounded-sm'
              style={{ backgroundColor: 'rgba(0,0,0, 0.7)', filter: 'blur(10px)' }}
            ></div>
            <Image
              className='max-w-lg m-auto'
              src={post?.thumbnailUrl ?? defaultAvt}
              alt={post?.title ?? ''}
              width={480}
              height={480}
              quality={100}
            />
          </div>
        )}
        <div
          className='mt-6 dynamic-content ql-editor'
          dangerouslySetInnerHTML={{ __html: post.content }}
        ></div>
        <Rating postId={post.id} />
      </main>
    );
  } catch (error: any) {
    return (
      <div className='text-center'>
        <h3 className='text-red-500 mb-4'>
          <div>slug : {params.slug}</div>
          Lỗi tải nội dung bài viết: {getApiErrorMessage(error)}
        </h3>
        <Link href={'/'}>
          <Button variant={'destructive'}>Quay lại trang chủ</Button>
        </Link>
      </div>
    );
  }
}

export default PostDetailPage;
