import { z } from 'zod';

export const categorySchema = z.object({
  id: z
    .number({ message: 'ID phải là chữ số lớn hơn 0.' })
    .positive({ message: 'ID phải là chữ số lớn hơn 0.' })
    .max(Number.MAX_SAFE_INTEGER),
  name: z
    .string()
    .min(1, { message: 'Tên phải có ít nhất 1 ký tự.' })
    .max(255, { message: 'Tên không được vượt quá 255 ký tự.' }),
  createdAt: z.string().default(''),
  updatedAt: z.string().default(''),
});

export type TCategory = z.infer<typeof categorySchema>;

export const createCategorySchema = categorySchema.pick({
  name: true,
});

export const categoryFilterSchema = z.object({
  pageIndex: z.number().min(1).default(1),
  pageSize: z.number().min(0).default(12),
  search: z.string().trim().default(''),
});
export type TCategoryFilter = z.input<typeof categoryFilterSchema>;
