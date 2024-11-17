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
import { createPostSchema, postSchema, TPost } from '@/models/post.model';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useLoadingStore } from '@/stores/loading.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CldUploadWidget, CldUploadButton } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PostService } from '@/services/post/post.service';
import { useToast } from '@/components/hooks/use-toast';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { useRouter } from 'next/navigation';
import ThumbnailImg from '@/components/post/thumbnail-image';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { TCategory } from '@/models/category.model';
import { CategoryService } from '@/services/category/category.service';
import { ROUTE } from '@/routes/routes';
import useAuthStore from '@/stores/auth.store';
import { Badge } from '@/components/ui/badge';

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

function PostUpdatePage({ params }: { params: { slug: string } }) {
  const {toast} = useToast();
  const router = useRouter();

  const [defaultPost, setDefaultPost] = useState<TPost>();

  const user = useAuthStore((s) => s.user);
  const [auth, setAuth] = useState(false);

  const [categories, setCategories] = useState<TCategory[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
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

  const setFormValues = useCallback(
    (post?: TPost) => {
      if (!post) return;
      setTimeout(() => {
        setThumbnailUrl(post.thumbnailUrl ?? '');
        setContent(post.content);
        const { title, content, thumbnailUrl, isPublished, categories } = post;
        form.reset({
          title,
          content,
          thumbnailUrl,
          isPublished,
          categories: categories.map((c) => ({ id: c.id })),
        });
        const editor = document.querySelector('#quill .ql-editor') as HTMLDivElement | null;
        if (editor) {
          editor.innerHTML = post.content;
        }
      }, 100);
    },
    [form]
  );

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
    setTimeout(async () => {
      await executeWithLoading(
        async () => {
          if (!defaultPost?.id) {
            return;
          }
          form.handleSubmit(async (post) => {
            const updatedPost = await PostService.updatePost(defaultPost.id, post);
            // alert(JSON.stringify(updatedPost));
            toast({ variant: 'success', title: 'Cập nhật bài viết thành công.' });
            setTimeout(() => {
              console.log({ updatedPost });
              router.replace(`/post/${updatedPost.slug}`);
            }, 100);
          })();
        },
        {
          onError: (err) => {
            toast({ variant: 'destructive', title: getApiErrorMessage(err) });
          },
        }
      );
    }, 100);
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

      if (params.slug) {
        PostService.getDetailPost({ slug: params.slug })
          .then((post) => {
            if (post.author.id !== user?.id) {
              throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
            }
            setDefaultPost(post);
            setFormValues(post);
          })
          .catch((err) => {
            toast({variant: 'default', title: getApiErrorMessage(err) });
            setTimeout(() => {
              router.replace(ROUTE.HOME);
            }, 100);
          });
      }
    } else {
    }
  }, [auth, form, params.slug, router, setFormValues, toast, user?.id]);
  return (
    <div className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      <ProtectedRoute setAuth={setAuth} />
      {!auth && <p>Đang xác thực ...</p>}
      {auth && (
        <main>
          <h2 className='mb-2'>Chỉnh sửa bài viết</h2>

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
              <small>
                <i>
                  Nếu nội dung bài viết không hiển thị, thử bấm vào{' '}
                  <Button
                    type='button'
                    variant='link'
                    className='underline px-2 text-sm'
                    onClick={({ currentTarget }) => {
                      if (window.confirm('Bạn có muốn reset nội dung bài viết không?')) {
                        currentTarget.disabled = true;
                        setFormValues(defaultPost);
                      }
                    }}
                  >
                    đây
                  </Button>{' '}
                  hoặc refresh lại trang.
                </i>
              </small>
              <Editor />
              <div className='text-sm flex flex-wrap gap-2'>
                Thể loại:{' '}
                {defaultPost?.categories.map((c, i) => (
                  <Badge key={i}>{c.name}</Badge>
                ))}
              </div>
              <FormField
                control={form.control}
                name='categories'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thay đổi thể loại</FormLabel>
                    <FormControl>
                      <MultiSelect
                        {...field}
                        options={categories.map((c) => ({ label: c.name, value: '' + c.id }))}
                        onValueChange={(values) =>
                          field.onChange(values.map((v) => ({ id: +v })))
                        }
                        placeholder='Chọn thể loại'
                        value={field.value?.map(({ id }) => `${id}`)}
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
              <Button
                type='button'
                variant='secondary'
                className='h-12 px-5 mr-2'
                onClick={() => {
                  if (window.confirm('Bạn có muốn hủy mọi thay đổi không?')) {
                    setFormValues(defaultPost);
                  }
                }}
              >
                Hủy thay đổi
              </Button>
              <Button type='submit' className='h-12 px-5' onClick={onSubmit}>
                Cập nhật
              </Button>
            </form>
          </Form>
        </main>
      )}
    </div>
  );
}

export default PostUpdatePage;
