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
    const res = await ServerSideAPI.get<IUser>(path('/profile/'+userId));
    return res.data;
  },
  followUser: async (userId: number, follow: boolean) => {
    const res = await API.post<{ id: number, notification?: boolean }>(path(`/follow/${userId}`), {follow});
    return res.data;
  },
  getFollowers: async (userId: number) => {
    const res = await ServerSideAPI.get<IUser[]>(path(`/followers/${userId}`));
    console.log('res.data', res.data);
    
    return res.data;
  },
  getFollowing: async (userId: number) => {
    const res = await ServerSideAPI.get<IUser[]>(path(`/following/${userId}`));
    return res.data;
  },
  followNotification: async (userId: number, notification: boolean) => {
    const res = await API.put<{ id: number, notification?: boolean }>(path(`/follow/notification/${userId}`), {notification});
    return res.data;
  },
  getUserFollow: async (userId: number) => {
    const res = await API.get<{id: number, notification: boolean}>(path(`/me/follow/${userId}`));
    return res.data;
  }
});
