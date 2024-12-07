'use client';
import Editor from '@/components/editor/editor';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import hljs from 'highlight.js';
import { createPostSchema, TPost } from '@/models/post.model';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useLoadingStore } from '@/stores/loading.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { CldUploadWidget } from 'next-cloudinary';
import { Button } from '@/components/ui/button';
import { PostService } from '@/services/post/post.service';
import { useToast } from '@/components/hooks/use-toast';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { useRouter } from 'next/navigation';
import ThumbnailImg from '@/components/post/thumbnail-image';
import { MultiSelect } from '@/components/ui/multi-select';
import { TCategory } from '@/models/category.model';
import { CategoryService } from '@/services/category/category.service';
import { ROUTE } from '@/routes/routes';
import useAuthStore from '@/stores/auth.store';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { TPostRevision } from '@/models/post-revision.model';
import RevisionHistory from './components/revision-history';
import 'highlight.js/styles/github.min.css';

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
  const { toast } = useToast();
  const router = useRouter();
  const [defaultPost, setDefaultPost] = useState<TPost>();
  const user = useAuthStore((s) => s.user);
  const [auth, setAuth] = useState(false);
  const [categories, setCategories] = useState<TCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const [thumbnailUrl, setThumbnailUrl] = useState('');

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
      const { title, content, thumbnailUrl, isPublished, categories } = post;
      setThumbnailUrl(thumbnailUrl ?? '');
      form.reset({
        title,
        content,
        thumbnailUrl,
        isPublished,
        categories: categories.map((c) => ({ id: c.id })),
      });
    },
    [form]
  );

  const onSubmit = async () => {
    if (!defaultPost?.id) return;

    await executeWithLoading(
      async () => {
        form.handleSubmit(async (post) => {
          const updatedPost = await PostService.updatePost(defaultPost.id, post);
          toast({ variant: 'success', title: 'Cập nhật bài viết thành công.' });
          setTimeout(() => {
            router.replace(
              `/post/${updatedPost.isPublished ? 'detail' : 'preview'}/${updatedPost.slug}`
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
        PostService.getDetailPost({ slug: params.slug }, true)
          .then((post) => {
            if (post.author.id !== user?.id) {
              throw new Error('Bạn không có quyền chỉnh sửa bài viết này');
            }
            setDefaultPost(post);
            setFormValues(post);
          })
          .catch((err) => {
            toast({ variant: 'default', title: getApiErrorMessage(err) });
            setTimeout(() => {
              router.replace(ROUTE.HOME);
            }, 100);
          });
      }
    }
  }, [auth, params.slug, router, setFormValues, toast, user?.id]);

  const handleSelectRevision = async (revision: TPostRevision) => {
    const rev = await PostService.restorePostRevisions({ revisionId: revision.id });
    toast({
      title: 'Đã khôi phục phiên bản cũ!',
      variant: 'success',
    });
    setTimeout(() => {
      router.replace(`/post/${rev.isPublished ? 'detail' : 'preview'}/${rev.slug}`);
    }, 100);
  };

  return (
    <div className='max-w-screen-lg m-auto flex flex-col justify-between lg:p-8 p-4'>
      <ProtectedRoute setAuth={setAuth} />
      {!auth && <p>Đang xác thực ...</p>}
      {auth && (
        <main>
          <h2 className='mb-2'>Chỉnh sửa bài viết</h2>

          <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className='space-y-4'>
              <Controller
                name='title'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiêu đề</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder='Tối đa 200 ký tự' maxLength={200} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name='thumbnailUrl'
                control={form.control}
                render={({ field }) => (
                  <FormItem className='hidden'>
                    <Input {...field} />
                  </FormItem>
                )}
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

              <Controller
                name='content'
                control={form.control}
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

              <div className='text-sm flex flex-wrap gap-2'>
                Thể loại hiện tại:{' '}
                {defaultPost?.categories.map((c, i) => (
                  <Badge key={i}>{c.name}</Badge>
                ))}
              </div>
              <Controller
                name='categories'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thể loại</FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={categories.map((c) => ({ label: c.name, value: '' + c.id }))}
                        value={field.value?.map(({ id }) => `${id}`)}
                        onChange={(values) => field.onChange(values.map((v) => ({ id: +v })))}
                        onBlur={field.onBlur}
                        placeholder='Chọn thể loại'
                        maxCount={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Controller
                name='isPublished'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className='flex justify-end items-center'>
                        <Input
                          type='checkbox'
                          checked={field.value}
                          onChange={field.onChange}
                          className='h-[20px] w-[20px]'
                        />
                        <FormLabel className='ml-2'>Xuất bản</FormLabel>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='flex justify-end gap-2'>
                <Button
                  type='button'
                  variant='secondary'
                  onClick={() => {
                    if (window.confirm('Bạn có muốn hủy mọi thay đổi không?')) {
                      setFormValues(defaultPost);
                    }
                  }}
                >
                  Hủy thay đổi
                </Button>
                <Button type='submit' onClick={onSubmit}>
                  Cập nhật
                </Button>
              </div>
            </form>
          </Form>

          {defaultPost && (
            <RevisionHistory postId={defaultPost.id} onSelectRevision={handleSelectRevision} />
          )}
        </main>
      )}
    </div>
  );
}

export default PostUpdatePage;
