'use client';
import { IUser } from '@/models/user.model';
import { tokenKey } from '@/services/api';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface IAuthData {
  user: IUser | undefined;
  setUser: (user: IUser | undefined) => void;
}

const useAuthStore = create(
  persist<IAuthData>(
    (set) => ({
      user: undefined,
      setUser: (user: IUser | undefined) => {
        set({ user: user });
      },
    }),
    {
      name: tokenKey,
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
