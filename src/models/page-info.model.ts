import { z } from 'zod';

export const pageInfoSchema = z.object({
  pageIndex: z.number().min(1).default(1),
  pageSize: z.number().min(0).default(12),
  totalPage: z.number().min(0).default(0),
  hasNextPage: z.boolean().default(false),
});

export type TPageInfo = z.infer<typeof pageInfoSchema>;
