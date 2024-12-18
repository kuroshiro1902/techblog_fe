import { IUser, userUpdateSchema } from '@/models/user.model';
import { API, apiPath, ServerSideAPI, tokenKey } from '../api';
import { z } from 'zod';

const path = apiPath('/user');
export const UserService = Object.freeze({
  getMe: async () => {
    const res = await API.get<IUser>(path('/me'));
    return res.data;
  },
  updateMe: async (data: z.infer<typeof userUpdateSchema>) => {
    const res = await API.put<IUser>(path('/me/update'), {data});
    return res.data;
  },
  updatePassword: async (data: {oldPassword: string, newPassword: string}) => {
    const res = await API.put<IUser>(path('/me/update-password'), {data});
    return res.data;
  },
  getUserProfile: async (userId: number) => {
    const res = await ServerSideAPI.get<IUser>(path('/'+userId));
    return res.data;
  }
});
