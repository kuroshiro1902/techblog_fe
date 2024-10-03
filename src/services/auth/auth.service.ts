import { User } from '@prisma/client';
import { API, apiPath } from '../api';

const path = apiPath('/auth');
export const AuthService = Object.freeze({
  login: async (credentials: { username: string; password: string }) => {
    const res = await API.post<{ user: User; token: string }>(
      path('login'),
      credentials
    );
    return res.data;
  },
});
