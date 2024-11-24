import { z } from 'zod';
import { userSchema } from './user.model';
import { postSchema } from './post.model';

export const commentSchema = z.object({
  id: z
    .number({ message: 'ID phải là chữ số lớn hơn 0.' })
    .positive({ message: 'ID phải là chữ số lớn hơn 0.' })
    .max(Number.MAX_SAFE_INTEGER),
  content: z
    .string().trim()
    .min(1, { message: 'Nội dung bình luận không được bỏ trống.' })
    .max(1000, { message: 'Nội dung bình luận không được quá 1000 ký tự.' }),
  parentCommentId: z.number({ message: 'ID phải là chữ số lớn hơn 0.' })
  .positive({ message: 'ID phải là chữ số lớn hơn 0.' })
  .max(Number.MAX_SAFE_INTEGER),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  user: userSchema.pick({ id: true, name: true, avatarUrl: true }),
});

export type TComment = z.infer<typeof commentSchema> & { likes?: number;
  dislikes?: number; };

export const createCommentSchema = commentSchema.pick({
  content: true,
}).merge(z.object({ postId: postSchema.shape.id, parentCommentId: commentSchema.shape.parentCommentId.optional() }));

export type TCreateComment = z.infer<typeof createCommentSchema>;

export const updateCommentSchema = commentSchema.pick({
  content: true,
});

export type TUpdateComment = z.infer<typeof updateCommentSchema>;
