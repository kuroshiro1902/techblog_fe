import { z } from "zod";

export const ratingSchema = z.object({
  score: z.number().int().min(1).max(5).nullable(),
  updatedAt: z.string().default(''),
})

export type TRating = Partial<z.infer<typeof ratingSchema>>