import Link from 'next/link';
import dayjs from 'dayjs';
import defaultAvt from '@/assets/default_avt.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { TPose } from '@/models/post.model';
import Image from 'next/image';
import { Button } from '../ui/button';

export interface PostCardProps {
  post?: TPose;
}

const LinkPost = ({ post, children }: any) => (
  <Link href={post?.slug ? `post/${post.slug}` : ''} target='_blank' title={post?.title}>
    {children}
  </Link>
);

function PostCard({ post }: PostCardProps) {
  return (
    // <Link href={post?.slug ? `post/${post.slug}` : ''} target='_blank'>
    <Card className='h-full flex flex-col justify-between'>
      <CardHeader>
        <CardTitle className='text-xl'>
          <LinkPost post={post}>{post?.title?.substring(0, 30)}...</LinkPost>
        </CardTitle>
        <CardDescription className=''>
          <Link
            title={post?.author.name}
            href={`/user/${post?.author?.id}`}
            target='_blank'
            className='underline font-bold flex items-center gap-2'
          >
            <Image
              className='w-6 aspect-[1/1] rounded-full'
              src={post?.author.avatarUrl ?? defaultAvt}
              alt={post?.author.name ?? ''}
              width={24}
              height={24}
              quality={50}
            />
            {post?.author?.name?.substring(0, 30)}
          </Link>

          <time className='text-[12px] pt-[2px]'>
            {post?.createdAt
              ? `${dayjs(post?.createdAt).tz('Asia/Bangkok').format('HH:mm DD/MM/YYYY')}`
              : ''}
          </time>
        </CardDescription>
      </CardHeader>
      {/* <CardContent>
        <div
          className='dynammic-content'
          dangerouslySetInnerHTML={{
            __html: (post?.content?.substring(0, 50) ?? '') + '...',
          }}
        ></div>
      </CardContent> */}
      <CardFooter className='block'>
        {post?.thumbnailUrl && (
          <LinkPost post={post}>
            <Image
              src={post?.thumbnailUrl}
              alt={post?.title}
              className='w-full aspect-[1/0.6]'
              width={600}
              height={600}
              quality={85}
            />
          </LinkPost>
        )}
        <LinkPost post={post}>
          <Button className='mt-3'>Xem chi tiết</Button>
        </LinkPost>
      </CardFooter>
    </Card>
    // </Link>
  );
}

export default PostCard;
