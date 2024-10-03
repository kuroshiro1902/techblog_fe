import { IUser } from '@/models/user.model';
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
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;
