import { AxiosError } from 'axios';

export const getApiErrorMessage = (error: AxiosError<any>) => {
  return (error?.response?.data?.message ??
    error?.message ??
    'Lỗi server!') as string;
};
