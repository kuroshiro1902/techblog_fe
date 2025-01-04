'use client';
import hljs from 'highlight.js';
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
import { Input } from '@/components/ui/input';
import 'highlight.js/styles/github.min.css';
import { useCategoryStore } from '@/stores/category.store';

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
  const { categories, fetchCategories } = useCategoryStore();
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
      useCategorize: false,
    },
  });

  const onSubmit = async () => {
    await executeWithLoading(
      async () => {
        form.handleSubmit(async (post) => {
          const createdPost = await PostService.createPost(post);
          toast({ variant: 'success', title: 'Tạo bài viết thành công.' });
          setTimeout(() => {
            router.replace(
              `/post/${createdPost.isPublished ? 'detail' : 'preview'}/${createdPost.slug}`
            );
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
    // if (auth) {
    //   CategoryService.filterCategories({})
    //     .then((res) => {
    //       setCategories(res.data);
    //     })
    //     .catch((err) => {
    //       toast({ variant: 'destructive', title: getApiErrorMessage(err) });
    //       setCategories([]);
    //     });
    // }
    fetchCategories();
  }, [auth, fetchCategories]);

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
                        className='!font-sans'
                        enableImage
                        modules={{
                          toolbar: {
                            container: [
                              [{ header: [1, 2, 3, false] }],
                              ['bold', 'italic', 'underline', 'strike'],
                              ['code-block'],
                              [{ list: 'ordered' }, { list: 'bullet' }],
                              ['link', 'image'],
                              [{ align: [] }],
                              ['clean'],
                            ],
                          },
                          syntax: { hljs },
                        }}
                        formats={[
                          'header',
                          'bold',
                          'italic',
                          'underline',
                          'strike',
                          'code-block',
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

              <Controller
                name='useCategorize'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center gap-2'>
                        <Input
                          type='checkbox'
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e.target.checked);
                          }}
                          className='h-[20px] w-[20px]'
                        />
                        <FormLabel className='ml-2'>Tự động phân loại thể loại ✨</FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.getValues('useCategorize') && (
                <p className='text-orange-500 text-sm'>
                  <i>
                    Hệ thống sẽ tự phân loại thể loại dựa trên nội dung bài viết sau khi bài
                    viết được xuất bản. Các thể loại được lựa chọn thủ công sẽ không được áp
                    dụng!
                  </i>
                </p>
              )}

              <FormField
                control={form.control}
                name='categories'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={categories.map((c) => ({ label: c.name, value: '' + c.id }))}
                        onChange={(values) => field.onChange(values.map((v) => ({ id: +v })))}
                        placeholder='Chọn thể loại'
                        value={field.value?.map(({ id }) => `${id}`)}
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage className='text-red-500' />
                  </FormItem>
                )}
              />
              <hr />
              <Controller
                name='isPublished'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex items-center'>
                        <Input
                          type='checkbox'
                          checked={field.value}
                          onChange={field.onChange}
                          className='h-[20px] w-[20px]'
                        />
                        <FormLabel className='ml-2'>
                          {field.value ? 'Xuất bản ngay' : 'Lưu nháp'}
                        </FormLabel>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' className='h-12 px-5' onClick={onSubmit}>
                {form.getValues('isPublished') ? 'Đăng bài' : 'Lưu nháp'}
              </Button>
            </form>
          </Form>
        </main>
      )}
    </div>
  );
}

export default PostCreatePage;
