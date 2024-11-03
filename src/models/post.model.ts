import { z } from 'zod';
import { userSchema } from './user.model';
import { categorySchema } from './category.model';

export const postSchema = z.object({
  id: z
    .number({ message: 'ID phải là chữ số lớn hơn 0.' })
    .positive({ message: 'ID phải là chữ số lớn hơn 0.' })
    .max(Number.MAX_SAFE_INTEGER),
  title: z
    .string()
    .min(1, { message: 'Tiêu đề phải có ít nhất 1 ký tự.' })
    .max(255, { message: 'Tiêu đề không được vượt quá 255 ký tự.' }),
  slug: z
    .string()
    .min(1, { message: 'Slug phải có ít nhất 1 ký tự.' })
    .max(255, { message: 'Slug không được vượt quá 255 ký tự.' }),
  content: z.string().min(1, { message: 'Nội dung bài viết không được bỏ trống.' }),
  thumbnailUrl: z
    .string()
    .max(255, { message: 'Url thumbnail không được vượt quá 500 ký tự.' })
    .optional(),
  isPublished: z.boolean().default(true),
  author: userSchema.pick({ id: true, name: true, avatarUrl: true }),
  categories: z.array(categorySchema).default([]),
  createdAt: z.string().default(''),
  updatedAt: z.string().default(''),
});

export type TPost = z.infer<typeof postSchema>;

export const createPostSchema = postSchema.pick({
  title: true,
  content: true,
  isPublished: true,
  thumbnailUrl: true,
}).extend({categories: z.array(categorySchema.pick({ id: true })).default([])});

export const postFilterSchema = z.object({
  pageIndex: z.number().min(1).default(1),
  pageSize: z.number().min(0).default(12),
  search: z.string().trim().default(''),
  author: z.string().trim().optional(),
});
export type TPostFilter = z.input<typeof postFilterSchema>;
