'use client';
import Editor from '@/components/editor/editor';
import FormInput from '@/components/form/formInput';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createPostSchema, postSchema } from '@/models/post.model';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useLoadingStore } from '@/stores/loading.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CldUploadWidget, CldUploadButton } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PostService } from '@/services/post/post.service';
import { toast } from '@/hooks/use-toast';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { useRouter } from 'next/navigation';
import ThumbnailImg from '@/components/post/thumbnail-image';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { TCategory } from '@/models/category.model';
import { CategoryService } from '@/services/category/category.service';

const SelectThumbnailBtn = ({ onSuccess }: { onSuccess: (url: string) => void }) => {
  return (
    <CldUploadWidget
      uploadPreset='techblog_upload_preset'
      config={{
        cloud: {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          apiKey: process.env.NEXT_PUBLIC_CLOUD_API_KEY,
          apiSecret: process.env.NEXT_PUBLIC_CLOUD_API_SECRET,
        },
      }}
      options={{
        maxFiles: 1,
        maxFileSize: 500 * 1024,
        uploadPreset: 'techblog_upload_preset',
        folder: 'techblog_images',
        resourceType: 'image',
      }}
      onSuccess={({ info }) => {
        if (typeof info === 'string') {
          return onSuccess(info);
        } else if (typeof info !== 'undefined') {
          return onSuccess(info.secure_url);
        } else {
          alert('Lỗi gán ảnh chủ đề bài viết, vui lòng thử lại.');
        }
      }}
    >
      {({ open }) => {
        return (
          <Button
            className='mt-1'
            title='Chọn ảnh bìa của bài viết'
            type='button'
            variant={'secondary'}
            onClick={() => open()}
          >
            Chọn ảnh bìa
          </Button>
        );
      }}
    </CldUploadWidget>
  );
};

function PostCreatePage() {
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [auth, setAuth] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const router = useRouter();
  //
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [content, setContent] = useState('');
  // const setIsLoading = useLoadingStore((s) => s.setIsLoading);
  const form = useForm<z.input<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      thumbnailUrl: '',
      categories: [],
      isPublished: true,
    },
    disabled: isSubmitting,
  });

  const onSubmit = async () => {
    // Set content to input
    const editor = document.querySelector('#quill .ql-editor') as HTMLDivElement | null;
    if (!editor) return;
    const content = editor.innerHTML;
    if (content === '<p><br></p>' || content.trim().length === 0) {
      return form.setError('content', { message: 'Nội dung bài viết không được để trống.' });
    }
    if (content.length > 7000) {
      return form.setError('content', {
        message: `Nội dung bài viết không được vượt quá 7000 ký tự. Số lượng hiện tại: ${content.length} ký tự.`,
      });
    }
    form.setValue('content', content);
    await executeWithLoading(
      async () => {
        form.handleSubmit(async (post) => {          
          const createdPost = await PostService.createPost(post);
          // alert(JSON.stringify(createdPost));
          toast({ variant: 'success', title: 'Tạo bài viết thành công.' });
          setTimeout(() => {
            console.log({ createdPost });
            router.replace(`/post/${createdPost.slug}`);
          }, 100);
        })();
      },
      {
        onError: (err) => {
          toast({ variant: 'destructive', title: getApiErrorMessage(err) });
        },
      }
    );
  };

  useEffect(() => {
    form.setValue('thumbnailUrl', thumbnailUrl ?? '');
  }, [thumbnailUrl, form]);

  useEffect(() => {
    if (auth) {
      CategoryService.filterCategories({}).then((res)=>{
        setCategories(res.data)
      }).catch((err)=>{
        toast({variant: 'destructive', title: getApiErrorMessage(err) });
        setCategories([]);
      })
    } else {
    }
  }, [auth]);
  return (
    <div className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      <ProtectedRoute setAuth={setAuth} />
      {!auth && <p>Đang xác thực ...</p>}
      {auth && (
        <main>
          <h2 className='mb-2'>Tạo bài viết mới</h2>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <FormInput
                required
                control={form.control}
                name='title'
                maxLength={200}
                hidden
                label='Tiêu đề'
                placeholder='Tối đa 200 ký tự'
              />
              <FormInput
                control={form.control}
                name='thumbnailUrl'
                maxLength={255}
                style={{ display: 'none', visibility: 'hidden' }}
                hidden
                label='Ảnh bìa'
                id='thumbnaiUrl-input'
                placeholder='Tối đa 255 ký tự'
              />

              {thumbnailUrl && (
                <>
                  <ThumbnailImg src={thumbnailUrl} />
                  <Button
                    variant={'destructive'}
                    type='button'
                    onClick={() => {
                      setThumbnailUrl('');
                    }}
                  >
                    Xóa ảnh bìa
                  </Button>
                </>
              )}
              {!thumbnailUrl && <SelectThumbnailBtn onSuccess={setThumbnailUrl} />}
              <FormInput
                required
                control={form.control}
                value={content}
                name='content'
                label='Nội dung'
                style={{ display: 'none', visibility: 'hidden' }}
                id='content-input'
                hidden
              />
              <Editor />
              <FormField
                control={form.control}
                name='categories'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={categories.map((c)=>({label: c.name, value: ''+c.id}))}
                        onValueChange={(values)=>field.onChange(values.map((v)=>({id: +v})))}
                        placeholder='Chọn thể loại'
                        value={field.value?.map(({id})=>`${id}`)}
                        // variant='inverted'
                        // animation={2}
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <FormInput
                disabled
                type='checkbox'
                control={form.control}
                name='isPublished'
                label='Xuất bản: '
                className='h-[20px] w-[20px] inline ml-2'
                defaultChecked
              />
              <Button type='submit' className='h-12 px-5' onClick={onSubmit}>
                Đăng bài
              </Button>
            </form>
          </Form>
        </main>
      )}
    </div>
  );
}

export default PostCreatePage;
