'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTE } from '@/routes/routes';
import { useToast } from '@/components/hooks/use-toast';
import { AuthService } from '@/services/auth/auth.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import { userSchema } from '@/models/user.model';
import FormInput from '@/components/form/formInput';
import dayjs from 'dayjs';

const { name, email, password, username } = userSchema.shape;
const signupFormSchema = z.object({
  name,
  username,
  password,
  dob: z.string().optional(),
  email,
});

function SignupPage() {
  const { toast } = useToast();
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: '',
      username: '',
      password: '',
      dob: '',
      email: '',
    },
    disabled: isSubmitting,
  });

  const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const data = await AuthService.signup({
        ...values,
        dob: !!values.dob ? dayjs(values.dob).unix() : undefined,
      });
      toast({
        title: 'Đăng ký thành công!',
      });
      setTimeout(() => {
        router.push(ROUTE.LOGIN);
      }, 100);
    } catch (error: any) {
      setSubmitMessage(getApiErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-4'>
      <h2 className='text-2xl font-bold mb-6'>Đăng Nhập</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormInput
            control={form.control}
            name='name'
            label='Họ tên'
            placeholder='Họ tên'
          />
          <FormInput
            control={form.control}
            name='username'
            label='Tên đăng nhập'
            placeholder='Tên đăng nhập'
          />
          <FormInput
            control={form.control}
            name='password'
            label='Mật khẩu'
            placeholder='Mật khẩu'
            type='password'
          />
          <FormInput
            control={form.control}
            name='email'
            label='Email'
            placeholder='Email'
            type='email'
          />
          <FormInput
            control={form.control}
            name='dob'
            label='Ngày sinh (tháng/ngày/năm)'
            placeholder='Ngày sinh (tháng/ngày/năm)'
            type='date'
          />
          <FormMessage>{submitMessage}</FormMessage>
          <Button disabled={isSubmitting} type='submit'>
            Đăng Ký
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SignupPage;
