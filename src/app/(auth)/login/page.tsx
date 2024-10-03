'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/routes/routes';
import { useToast } from '@/components/hooks/use-toast';
import { AuthService } from '@/services/auth/auth.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';

const loginFormSchema = z.object({
  username: z
    .string()
    .min(6, { message: 'Tên đăng nhập phải có ít nhất 6 ký tự.' })
    .max(60, { message: 'Tên đăng nhập không được vượt quá 60 ký tự.' }),
  password: z
    .string()
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
    .max(60, { message: 'Mật khẩu không được vượt quá 60 ký tự.' }),
});

function LoginPage() {
  const { toast } = useToast();
  const [submitMessage, setSubmitMessage] = useState('');
  const router = useRouter();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setSubmitMessage('');
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
    }
    try {
      const data = await AuthService.login(values);
      console.log({ data });

      toast({
        title: 'Đăng nhập thành công!',
        description: 'TEST',
      });
      setTimeout(() => {
        router.push(ROUTE.HOME);
      }, 100);
    } catch (error: any) {
      setSubmitMessage(getApiErrorMessage(error));
    } finally {
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
      }
    }
  };

  return (
    <div className='max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6'>Đăng Nhập</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên đăng nhập</FormLabel>
                <FormControl>
                  <Input placeholder='Tên đăng nhập ' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mật khẩu</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Mật khẩu ít nhất 6 ký tự'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{submitMessage}</FormMessage>
          <Button ref={submitButtonRef} type='submit'>
            Đăng Nhập
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default LoginPage;
