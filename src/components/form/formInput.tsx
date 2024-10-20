import { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input, InputProps } from '../ui/input'; // Import InputProps từ shadcn/ui nếu có
import { HTMLInputTypeAttribute } from 'react';

interface FormInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends InputProps {
  // Kế thừa từ InputProps để nhận thêm các props của Input
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
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
            <Input
              type={type}
              placeholder={placeholder}
              {...field}
              {...props} // Truyền tất cả các props vào Input
            />
          </FormControl>
          <FormMessage className='text-red-500' />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
