// updatePasswordForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/hooks/use-toast';
import { UserService } from '@/services/user/user.service';
import { getApiErrorMessage } from '@/utils/getApiErrorMessage.util';
import FormInput from '@/components/form/formInput';
import { useLoadingStore } from '@/stores/loading.store';
import Overlay from '@/components/common/overlay';
import { userSchema } from '@/models/user.model';

interface Props {
  onClose?: () => void;
}

// Thêm logic xác thực mật khẩu mới khớp nhau
const updatePasswordSchema = z
  .object({
    oldPassword: userSchema.shape.password,
    newPassword: userSchema.shape.password,
    confirmNewPassword: userSchema.shape.password,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Mật khẩu mới và xác nhận mật khẩu phải giống nhau',
    path: ['confirmNewPassword'], // Chỉ định vị trí lỗi
  });

function UpdatePasswordForm({ onClose = () => {} }: Props) {
  const { toast } = useToast();
  const executeWithLoading = useLoadingStore((s) => s.executeWithLoading);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    disabled: isSubmitting,
  });

  const onSubmit = async (values: z.infer<typeof updatePasswordSchema>) => {
    setSubmitMessage('');
    setIsSubmitting(true);

    await executeWithLoading(
      async () => {
        const { data, isSuccess } = await UserService.updatePassword({
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
        });

        if (isSuccess && data) {
          toast({
            variant: 'success',
            title: 'Cập nhật mật khẩu thành công!',
          });
          onClose();
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
    <Overlay onClose={onClose}>
      <h2 className='text-current text-2xl font-bold mb-6'>Cập nhật mật khẩu</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormInput
            control={form.control}
            label='Mật khẩu cũ'
            name='oldPassword'
            placeholder='Nhập mật khẩu cũ'
            type='password'
            required
          />
          <FormInput
            control={form.control}
            label='Mật khẩu mới'
            name='newPassword'
            placeholder='Nhập mật khẩu mới'
            type='password'
            required
          />
          <FormInput
            control={form.control}
            label='Xác nhận mật khẩu mới'
            name='confirmNewPassword'
            placeholder='Nhập lại mật khẩu mới'
            type='password'
            required
          />
          <FormMessage>{submitMessage}</FormMessage>
          <div className='flex justify-end'>
            <Button disabled={isSubmitting} type='submit'>
              Cập Nhật
            </Button>
          </div>
        </form>
      </Form>
    </Overlay>
  );
}

export default UpdatePasswordForm;
