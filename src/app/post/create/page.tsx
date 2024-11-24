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
import { Button } from '@/components/ui/button';
import { createPostSchema } from '@/models/post.model';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useLoadingStore } from '@/stores/loading.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { PostService } from '@/services/post/post.service';
import { toast } from '@/hooks/use-toast';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { useRouter } from 'next/navigation';
import ThumbnailImg from '@/components/post/thumbnail-image';
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
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const router = useRouter();

  const form = useForm<z.input<typeof createPostSchema>>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      content: '',
      thumbnailUrl: '',
      categories: [],
      isPublished: true,
    },
  });

  const onSubmit = async () => {
    await executeWithLoading(
      async () => {
        form.handleSubmit(async (post) => {
          const createdPost = await PostService.createPost(post);
          toast({ variant: 'success', title: 'Tạo bài viết thành công.' });
          setTimeout(() => {
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
      CategoryService.filterCategories({})
        .then((res) => {
          setCategories(res.data);
        })
        .catch((err) => {
          toast({ variant: 'destructive', title: getApiErrorMessage(err) });
          setCategories([]);
        });
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
                label='Tiêu đề'
                placeholder='Tối đa 200 ký tự'
              />

              <FormInput
                control={form.control}
                name='thumbnailUrl'
                maxLength={255}
                style={{ display: 'none' }}
                hidden
                label='Ảnh bìa'
                id='thumbnaiUrl-input'
              />

              {thumbnailUrl && (
                <>
                  <ThumbnailImg src={thumbnailUrl} />
                  <Button
                    variant={'destructive'}
                    type='button'
                    onClick={() => setThumbnailUrl('')}
                  >
                    Xóa ảnh bìa
                  </Button>
                </>
              )}
              {!thumbnailUrl && <SelectThumbnailBtn onSuccess={setThumbnailUrl} />}

              <FormField
                control={form.control}
                name='content'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nội dung</FormLabel>
                    <FormControl>
                      <Editor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder='Viết nội dung bài viết...'
                        enableImage
                        modules={{
                          toolbar: {
                            container: [
                              [{ header: [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link', 'image'],
                              [{ align: [] }],
                              ['clean'],
                            ],
                          },
                        }}
                        formats={[
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'list',
                          'link',
                          'image',
                          'align',
                        ]}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categories'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={categories.map((c) => ({ label: c.name, value: '' + c.id }))}
                        onValueChange={(values) =>
                          field.onChange(values.map((v) => ({ id: +v })))
                        }
                        placeholder='Chọn thể loại'
                        value={field.value?.map(({ id }) => `${id}`)}
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />

              <FormInput
                type='checkbox'
                control={form.control}
                name='isPublished'
                label='Xuất bản'
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
