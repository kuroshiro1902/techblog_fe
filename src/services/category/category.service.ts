import { API, apiPath, ServerSideAPI, tokenKey } from '../api';
import { TFilterResponse } from '@/models/filter-response.model';
import { z } from 'zod';
import { TCategory, TCategoryFilter } from '@/models/category.model';

const path = apiPath('/categories');

export const CategoryService = Object.freeze({
  filterCategories: async (filter: TCategoryFilter) => {
    const res = await ServerSideAPI.get<TFilterResponse<TCategory>>(path('/'), filter);
    const { isSuccess, data, message } = res.data;
    if (isSuccess && data) {
      return data;
    } else {
      throw new Error(message);
    }
  },
  // getDetailPost: async (filter: { slug: string }) => {
  //   const res = await ServerSideAPI.get<TPost>(path('/detail'), filter);
  //   const { isSuccess, data, message } = res.data;
  //   if (isSuccess && data) {
  //     return data;
  //   } else {
  //     throw new Error(message);
  //   }
  // },
  // createPost: async (post: z.input<typeof createPostSchema>) => {
  //   const res = await API.post<TPost>(path('/create'), { data: post });
  //   const { isSuccess, data, message } = res.data;
  //   if (isSuccess && data) {
  //     return data;
  //   } else {
  //     throw new Error(message);
  //   }
  // },
});
