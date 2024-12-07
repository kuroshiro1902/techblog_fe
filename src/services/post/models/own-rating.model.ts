import { TPost } from "@/models/post.model";
import { TRating } from "@/models/rating.model";

export type TOwnRating = TRating & {id: number, post?: Pick<TPost, 'slug' | 'title'>}