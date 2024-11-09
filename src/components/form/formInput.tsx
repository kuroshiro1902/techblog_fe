import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input, InputProps } from '../ui/input'; // Import InputProps từ shadcn/ui nếu có
import { HTMLInputTypeAttribute } from 'react';
import { Textarea } from '../ui/textarea';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends InputProps {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  type?: HTMLInputTypeAttribute | 'textarea';
}

const FormInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder = 'Nhập giá trị...',
  type,
  required,
  ...props // Nhận tất cả các props của Input
}: FormInputProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel>
              {required && <span className='text-red-500'>* </span>}
              {label}
            </FormLabel>
          )}
          <FormControl>
            {type === 'textarea' ? (
              <Textarea
                placeholder={placeholder}
                {...field}
                {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                onChange={(e) =>
                  field.onChange(e as unknown as React.ChangeEvent<HTMLTextAreaElement>)
                }
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                {...props}
                onChange={(e) =>
                  field.onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
                } // Type assertion here
              />
            )}
          </FormControl>
          <FormMessage className='text-red-500' />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
