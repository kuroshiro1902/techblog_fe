import { toast } from '@/hooks/use-toast';
import { API, apiPath, ServerSideAPI, tokenKey } from '../api';
import { TFilterResponse } from '@/models/filter-response.model';
import { TPose, TPostFilter } from '@/models/post.model';

const path = apiPath('/posts');

export const PostService = Object.freeze({
  filterPosts: async (filter: TPostFilter) => {
    const res = await ServerSideAPI.get<TFilterResponse<TPose>>(path('/'), filter);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  getDetailPost: async (filter: { slug: string }) => {
    const res = await ServerSideAPI.get<TPose>(path('/detail'), filter);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
});
