import { AxiosError } from 'axios';

export const getApiErrorMessage = (error: AxiosError<any>) => {
  return (error?.response?.data?.message ??
    error?.message ??
    'Có lỗi xảy ra! Vui lòng thử lại sau.') as string;
};
