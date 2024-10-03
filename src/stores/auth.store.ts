import { User } from '@prisma/client';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface IAuthData {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
}

const useAuthStore = create(
  persist<IAuthData>(
    (set) => ({
      user: undefined,
      setUser: (user: User | undefined) => {
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
