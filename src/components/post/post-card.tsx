import Link from 'next/link';
import defaultThumbnail from '@/assets/default_thumbnail.png';
import defaultAvt from '@/assets/default_avt.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { TPost } from '@/models/post.model';
import Image from 'next/image';
import { Button } from '../ui/button';
import { formatDate } from 'date-fns';
import { EyeIcon } from 'lucide-react';
import { Badge } from '../ui/badge';

export interface PostCardProps {
  post?: TPost;
}

const LinkPost = ({ post, children }: any) => (
  <Link
    className='text-overflow-max-line-2'
    href={post?.slug ? `post/${post.slug}` : ''}
    target='_blank'
    title={post?.title}
  >
    {children}
  </Link>
);

function PostCard({ post }: PostCardProps) {
  return (
    <Card className='bg-card border-border h-full flex flex-col justify-between'>
      <CardHeader className='pb-1'>
        <CardTitle className='text-xl'>
          <LinkPost post={post}>{post?.title}</LinkPost>
        </CardTitle>
      </CardHeader>
      <CardFooter className='block'>
        <CardDescription className=''>
          <span className='block mb-1'>
            {post?.categories.slice(0, 2).map((c, i) => (
              <Badge className='mr-1' key={i}>
                {c.name}
              </Badge>
            ))}
          </span>
          <time className='text-[12px] pt-[2px]'>
            {post?.createdAt ? `${formatDate(post.createdAt, 'HH:mm dd/MM/yyyy')}` : ''}
          </time>
          <Link
            title={post?.author.name}
            href={`/user/${post?.author?.id}`}
            target='_blank'
            className='pt-1 underline font-bold flex items-center gap-2'
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
          <span className='block pt-2 pb-1'>
            <LinkPost post={post}>
              <Image
                src={post?.thumbnailUrl || defaultThumbnail}
                alt={post?.title || 'Bài viết không có tiêu đề'}
                className='w-full aspect-[1/0.6] rounded-lg'
                width={600}
                height={600}
                quality={post?.thumbnailUrl ? 85 : 30}
              />
            </LinkPost>
          </span>
          <small title={(post?.views || 0) + ' lượt xem'}>
            {post?.views} <EyeIcon className='inline' size={14} />
          </small>
        </CardDescription>
        <LinkPost post={post}>
          <Button className='mt-3 float-right'>Xem chi tiết</Button>
        </LinkPost>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
