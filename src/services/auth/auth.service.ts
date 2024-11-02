import { IUser } from '@/models/user.model';
import { API, apiPath, tokenKey } from '../api';

const path = apiPath('/auth');
export const AuthService = Object.freeze({
  login: async (credentials: { username: string; password: string }) => {
    console.log('Call api đăng nhập');

    const res = await API.post<{ user: IUser; token: string }>(path('login'), credentials);
    return res.data;
  },
  signup: async (credentials: Partial<IUser>) => {
    const res = await API.post<IUser>(path('signup'), credentials);
    return res.data;
  },
  verifyAndRefreshToken: async () => {
    console.log('Call api verifyAndRefreshToken');

    return await API.post<{ user: IUser; token: string }>(path('refresh-token'))
      .then(({ data }) => {
        return data.data ?? null;
      })
      .catch((err: any) => {
        return null;
      });
  },
  setToken: (token: string) => {
    if (token) {
      localStorage.setItem(tokenKey, token);
    }
  },
  deleteToken: () => {
    localStorage.removeItem(tokenKey);
  },
  getToken: () => {
    return localStorage.getItem(tokenKey);
  },
});
