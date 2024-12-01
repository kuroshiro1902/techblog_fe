import { toast } from '@/hooks/use-toast';
import { API, apiPath, ServerSideAPI, tokenKey } from '../api';
import { TFilterResponse } from '@/models/filter-response.model';
import { createPostSchema, TPost, TPostFilter } from '@/models/post.model';
import { z } from 'zod';
import { TRating } from '@/models/rating.model';
import { TComment, TCreateComment, updateCommentSchema } from '@/models/comment.model';

const path = apiPath('/posts');

export const PostService = Object.freeze({
  filterPosts: async (filter: TPostFilter) => {
    const res = await ServerSideAPI.get<TFilterResponse<TPost>>(path('/'), filter);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  getDetailPost: async (filter: { slug: string }) => {
    const res = await ServerSideAPI.get<TPost>(path('/detail'), filter);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  createPost: async (post: z.input<typeof createPostSchema>) => {
    const res = await API.post<TPost>(path('/create'), { data: post });
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  updatePost: async (postId: number, post: z.input<typeof createPostSchema>) => {
    const res = await API.put<TPost>(path('/update/' + postId), { data: post });
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  getOwnPosts: async () => {
    const res = await API.get<TFilterResponse<TPost>>(path('/me'));
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data?.data) {
      return data.data;
    } else {
      throw new Error(message);
    }
  },
  // getPostsOfAuthor: async (authorId: number) => {
  //   const res = await ServerSideAPI.get<TPost>(path('?authorId='+authorId), );
  //   const { isSuccess, data, message } = res.data;
  //   if (isSuccess && data) {
  //     return data;
  //   } else {
  //     throw new Error(message);
  //   }
  // }
  getOwnRatingOfPost: async (postId: number) => {
    const res = await API.get<TRating>(path('/rating/' + postId));
    const { isSuccess, data, message } = res.data;

    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  rating: async (postId: number, score: number) => {
    const res = await API.put<{
      score: number;
      updatedAt: Date;
    }>(path('/rating/' + postId), { score });
    const { isSuccess, data, message } = res.data;

    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },

  loadComments: async (params: {
    postId?: number;
    parentCommentId?: number;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    const res = await API.get<TFilterResponse<TComment>>(path('/comments'), params);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },

  createComment: async (comment: TCreateComment) => {
    const res = await API.post<TComment>(path('/comment/create'), { data: comment });
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },

  ratingComment: async (commentId: number, score: number) => {
    const res = await API.post<TComment>(path('/comment/rating'), { commentId, score });
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },

  updateComment: async (commentId: number, data: z.input<typeof updateCommentSchema>) => {
    const res = await API.put<TComment>(path('/comment/update'), { commentId, data });
    const { isSuccess, data: comment, message } = res.data;
    if (isSuccess && comment) {
      return comment;
    } else {
      throw new Error(message);
    }
  },

  deleteComment: async (commentId: number) => {
    const res = await API.delete<TComment>(path(`/comments/`+commentId));
    const { isSuccess, data: comment, message } = res.data;
    if (isSuccess && comment) {
      return comment;
    } else {
      throw new Error(message);
    }
  },
});
