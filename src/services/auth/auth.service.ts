import { IUser } from '@/models/user.model';
import { API, apiPath } from '../api';

const path = apiPath('/auth');
export const AuthService = Object.freeze({
  login: async (credentials: { username: string; password: string }) => {
    const res = await API.post<{ user: IUser; token: string }>(
      path('login'),
      credentials
    );
    return res.data;
  },
  signup: async (credentials: Partial<IUser>) => {
    const res = await API.post<IUser>(path('signup'), credentials);
    return res.data;
  },
});
