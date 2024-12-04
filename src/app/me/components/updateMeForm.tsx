'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/hooks/use-toast';
import { UserService } from '@/services/user/user.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import FormInput from '@/components/form/formInput';
import useAuthStore from '@/stores/auth.store';
import { useLoadingStore } from '@/stores/loading.store';
import { IUser, userUpdateSchema } from '@/models/user.model';
import { PenIcon } from 'lucide-react';
import Overlay from '@/components/common/overlay';
import { DatePicker } from '@/components/common/date-picker';

interface props {
  user?: IUser;
  onClose?: () => void;
}

const meUpdateSchema = userUpdateSchema.omit({ avatarUrl: true });

function UpdateMeForm({ user, onClose = () => {} }: props) {
  const { toast } = useToast();
  const setUser = useAuthStore((s) => s.setUser);
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof meUpdateSchema>>({
    resolver: zodResolver(meUpdateSchema),
    defaultValues: {
      name: user?.name ?? '',
      description: user?.description ?? '',
      password: user?.password ?? '',
      email: user?.email ?? undefined,
      dob: user?.dob ?? undefined,
    },
    disabled: isSubmitting,
  });
  const onSubmit = async (values: z.infer<typeof meUpdateSchema>) => {
    setSubmitMessage('');
    setIsSubmitting(true);
    await executeWithLoading(
      async () => {
        console.log({ values });

        const { data, isSuccess } = await UserService.updateMe(values);
        if (isSuccess && data) {
          toast({
            variant: 'success',
            title: 'Cập nhật thông tin thành công!',
          });
          onClose();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
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
    <>
      <Overlay onClose={onClose}>
        <h2 className='text-current text-2xl font-bold mb-6'>Chỉnh sửa thông tin</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormInput
              control={form.control}
              label='Tên'
              name='name'
              placeholder='Tên của bạn'
              required
            />
            <FormInput
              control={form.control}
              label='Email'
              name='email'
              placeholder='Email của bạn'
              type='email'
            />
            <FormInput
              type='textarea'
              style={{ minHeight: 120 }}
              control={form.control}
              label='Mô tả'
              name='description'
              placeholder='Mô tả ngắn gọn về bạn'
            />
            <FormLabel className='block'>Ngày sinh</FormLabel>
            <DatePicker
              placeholder='Chọn ngày sinh'
              value={(() => {
                const dob = form.getValues().dob;
                if (!dob) return undefined;
                else {
                  return new Date(dob * 1000);
                }
              })()}
              onSelect={(date) => {
                if (date) {
                  form.setValue('dob', Math.floor(date.getTime() / 1000)); // Get Unix timestamp in seconds
                }
              }}
              mode={'single'}
            />
            <hr />
            <FormInput
              control={form.control}
              label='Nhập mật khẩu để xác nhận thay đổi'
              name='password'
              placeholder='Nhập mật khẩu để xác nhận thực hiện thay đổi'
              type='password'
              required
            />
            <hr />

            <FormMessage>{submitMessage}</FormMessage>
            <div className='flex justify-end'>
              <Button disabled={isSubmitting} type='submit'>
                Cập Nhật
              </Button>
            </div>
          </form>
        </Form>
      </Overlay>
    </>
  );
}

export default UpdateMeForm;
