import { fakeDelay } from '@/utils/fakeDelay.utl';
import { create } from 'zustand';

type LoadingOptions = {
  /**
   * Có dừng loading khi thực hiện xong cb hay không (thành công hay thất bại).
   * @default true
   */
  stopWhenFinish?: boolean;
  onSuccess?: () => any;
  onError?: (error: any) => any;
  onFinally?: () => any;
};

interface LoadingData {
  isLoading: boolean;
  executeWithLoading: (
    cb: () => Promise<void>,
    options?: LoadingOptions
  ) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingData>((set) => ({
  isLoading: false,

  // Bắt đầu trạng thái loading, gọi callback bất đồng bộ
  executeWithLoading: async (
    cb: () => Promise<void>,
    options?: LoadingOptions
  ): Promise<void> => {
    set({ isLoading: true });
    fakeDelay(async () => {
      try {
        await cb();
        await options?.onSuccess?.();
      } catch (err) {
        await options?.onError?.(err);
      } finally {
        const stopWhenFinish = options?.stopWhenFinish ?? true;
        if (stopWhenFinish) {
          set({ isLoading: false });
        }
        await options?.onFinally?.();
      }
    });
  },

  setIsLoading: (isLoading) => set({ isLoading }),
}));
