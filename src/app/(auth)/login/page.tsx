'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ROUTE } from '@/routes/routes';
import { useToast } from '@/components/hooks/use-toast';
import { AuthService } from '@/services/auth/auth.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { userSchema } from '@/models/user.model';
import FormInput from '@/components/form/formInput';
import useAuthStore from '@/stores/auth.store';
import { useLoadingStore } from '@/stores/loading.store';
import { useSocket } from '@/stores/socket.store';

const loginFormSchema = z.object({
  username: userSchema.shape.username,
  password: userSchema.shape.password,
});

function LoginPage() {
  const { toast } = useToast();
  const setUser = useAuthStore((s) => s.setUser);
  const connect = useSocket((s) => s.connect);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const searchParams = useSearchParams();
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    disabled: isSubmitting,
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setSubmitMessage('');
    setIsSubmitting(true);
    await executeWithLoading(
      async () => {
        const { data, isSuccess } = await AuthService.login(values);
        if (isSuccess && data) {
          AuthService.setToken(data.token);
          setUser(data.user);
          connect(data.token);
          toast({
            variant: 'success',
            title: 'Đăng nhập thành công!',
          });
          setTimeout(() => {
            const redirectUrl = searchParams.get('redirect') || ROUTE.HOME;
            router.replace(redirectUrl);
          }, 100);
        }
      },
      {
        onError: (error) => {
          setSubmitMessage(getApiErrorMessage(error));
          setIsSubmitting(false);
        },
      }
    );
  };

  return (
    <div className='max-w-md mx-auto p-4' key={'' + Math.random()}>
      <h2 className='text-2xl font-bold mb-6'>Đăng Nhập</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormInput
            control={form.control}
            label='Tên đăng nhập'
            name='username'
            placeholder='Tên đăng nhập ít nhất 6 ký tự.'
          />
          <FormInput
            control={form.control}
            label='Mật khẩu'
            name='password'
            placeholder='Mật khẩu ít nhất 6 ký tự.'
            type='password'
            autoComplete='current-password'
          />
          <FormMessage>{submitMessage}</FormMessage>
          <Button disabled={isSubmitting} type='submit'>
            Đăng Nhập
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginPage;
