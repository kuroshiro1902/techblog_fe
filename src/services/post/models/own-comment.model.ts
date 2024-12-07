import { TComment } from "@/models/comment.model";
import { TPost } from "@/models/post.model";

export type TOwnComment = Pick<TComment, 'id' | 'content' | 'updatedAt'> & {id: number, post?: Pick<TPost, 'slug' | 'title'>}