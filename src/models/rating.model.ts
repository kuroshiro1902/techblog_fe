import { ERatingScore } from '@/constant/rating-score.const';
import { z } from 'zod';

export const ratingSchema = z.object({
  score: z.number().int().min(ERatingScore.DISLIKE).max(ERatingScore.LIKE).nullable(),
  updatedAt: z.string().default(''),
});

export type TRating = Partial<z.infer<typeof ratingSchema>>;

export type TRatingInfo =  { likes?: number; dislikes?: number };
