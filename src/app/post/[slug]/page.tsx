import { Button } from '@/components/ui/button';
import { TFilterResponse } from '@/models/filter-response.model';
import { TPose } from '@/models/post.model';
import { PostService } from '@/services/post/post.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import Link from 'next/link';

async function PostDetailPage({ params }: { params: { slug: string } }) {
  try {
    const post = await PostService.getDetailPost({ slug: params.slug });

    return (
      <main className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4 '>
        <h1>{post?.title}</h1>
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
