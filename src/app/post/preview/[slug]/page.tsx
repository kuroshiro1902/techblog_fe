'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import defaultAvt from '@/assets/default_avt.png';
import dayjs from 'dayjs';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import DynamicContent from '@/components/common/dynamic-content';
import { TPost } from '@/models/post.model';
import { useEffect, useRef, useState } from 'react';
import { PostService } from '@/services/post/post.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import useAuthStore from '@/stores/auth.store';
import ProtectedRoute from '@/routes/ProtectedRoute';
import 'highlight.js/styles/github.min.css';
import hljs from 'highlight.js';

export default function PostPreviewPage({ params }: { params: { slug: string } }) {
  const contentRef = useRef<HTMLDivElement>(null);

  const [post, setPost] = useState<TPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auth, setAuth] = useState(false);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!auth || !user) return;

    const fetchPost = async () => {
      try {
        const fetchedPost = await PostService.getDetailPost({ slug: params.slug }, true);

        // Kiểm tra quyền xem bài viết
        if (fetchedPost.author.id !== user.id) {
          throw new Error('Bạn không có quyền xem trước bài viết này');
        }

        setPost(fetchedPost);
      } catch (err: any) {
        setError(getApiErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.slug, auth, user]);

  useEffect(() => {
    const highlightCode = () => {
      contentRef.current?.querySelectorAll('select.ql-ui').forEach((e) => e.remove());
      contentRef.current?.querySelectorAll('[data-language]').forEach((el) => {
        const language = el.getAttribute('data-language'); // Lấy giá trị ngôn ngữ
        const code = el.textContent; // Lấy nội dung code

        if (code && language) {
          // Highlight code với ngôn ngữ chỉ định
          try {
            const highlightedCode = hljs.highlight(code, { language }).value;

            // Gắn lại mã code đã highlight vào element
            el.innerHTML = highlightedCode;
          } catch (error) {}
          el.classList.add('hljs', 'font-mono'); // Đảm bảo thêm class hljs để áp dụng style
        }
      });
    };
    highlightCode();
  }, [post?.slug]);

  if (!auth) {
    return (
      <>
        <ProtectedRoute setAuth={setAuth} />
        <div>Đang xác thực...</div>
      </>
    );
  }

  if (loading) {
    return <div className='text-center p-8'>Đang tải bài viết...</div>;
  }

  if (error || !post) {
    return (
      <div className='text-center p-8'>
        <h3 className='text-red-500 mb-4'>{error || 'Không tìm thấy bài viết'}</h3>
        <Link href='/'>
          <Button variant='destructive'>Quay lại trang chủ</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-xl font-semibold'>Xem trước bài viết</h2>
        <Link href={`/post/update/${post.slug}`}>
          <Button variant='outline'>Chỉnh sửa bài viết</Button>
        </Link>
      </div>

      {/* Badge trạng thái */}
      <div className='mb-4'>
        <Badge variant={post.isPublished ? 'default' : 'secondary'}>
          {post.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
        </Badge>
      </div>

      {/* Nội dung bài viết */}
      <h1 className='mb-2 text-linear-primary'>{post.title}</h1>

      <div className='flex gap-4 flex-wrap items-center mb-4'>
        <Badge variant='secondary' className='py-1'>
          <ThumbsUpIcon className='mr-2' size={16} /> {post.rating?.likes ?? 0}
        </Badge>
        <Badge variant='destructive' className='py-1'>
          <ThumbsDownIcon className='mr-2' size={16} /> {post.rating?.dislikes ?? 0}
        </Badge>
      </div>

      <div className='inline-flex items-center gap-4 text-sm'>
        <span>Thể loại: </span>
        {post.categories.length === 0 && <i>Không xác định</i>}
        {post.categories.map((category, i) => (
          <Badge key={i} className='bg-foreground'>
            {category.name}
          </Badge>
        ))}
      </div>

      <div className='py-2'></div>
      <div className='inline-flex items-center gap-4'>
        <div className='font-bold inline-flex items-center gap-2'>
          <Image
            className='w-6 aspect-[1/1] rounded-full'
            src={post.author.avatarUrl ?? defaultAvt}
            alt={post.author.name ?? ''}
            width={24}
            height={24}
            quality={50}
          />
          <span>{post.author.name?.substring(0, 30)}</span>
        </div>
        <span>-</span>
        <time className='pt-[2px]'>
          {post.createdAt
            ? `${dayjs(post.createdAt).format('HH:mm DD/MM/YYYY')}`
            : 'Chưa xuất bản'}
        </time>
      </div>

      {post.thumbnailUrl && (
        <div className='image-ctn text-center relative mt-6'>
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
            src={post.thumbnailUrl}
            alt={post.title}
            width={480}
            height={480}
            quality={100}
          />
        </div>
      )}

      <div className='mt-6'>
        <div
          ref={contentRef}
          className={`dynamic-content ql-editor`}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>
    </main>
  );
}
