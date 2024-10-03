import { ENV } from '@/environments/env';
import axios from 'axios';

export const tokenKey = 'techblog-access-token';

export interface IApiResponse<T> {
  isSuccess: boolean;
  message?: string;
  data?: T;
}

export function parseApiURL(path: string, searchParams?: any) {
  // Tạo base URL từ SERVER_URL và path
  const baseURL = `${ENV.SERVER_URL}/api/${path}`;
  if (!baseURL.startsWith('http')) {
    throw Error('Invalid base URL.');
  }

  // Xử lý các searchParams nếu có
  let searchQuery = '';
  if (searchParams) {
    const urlSearch = [];
    for (const key in searchParams) {
      if (Array.isArray(searchParams[key])) {
        for (const value of searchParams[key]) {
          urlSearch.push(
            `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          );
        }
      } else {
        urlSearch.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`
        );
      }
    }
    searchQuery = urlSearch.length > 0 ? `?${urlSearch.join('&')}` : '';
  }

  // Trả về URL hoàn chỉnh
  return `${baseURL}${searchQuery}`;
}

class ApiService {
  getToken() {
    return localStorage.getItem(tokenKey);
  }

  async get<T>(path: string, searchParams?: { [key: string]: any }) {
    const url = parseApiURL(path, searchParams);
    return axios.get<IApiResponse<T>>(url, {
      headers: { Authorization: this.getToken() },
    });
  }

  async post<T>(path: string, payload?: { [key: string]: any }) {
    const url = parseApiURL(path);
    return axios.post<IApiResponse<T>>(url, payload, {
      headers: { Authorization: this.getToken() },
    });
  }

  async put<T>(path: string, payload?: { [key: string]: any }) {
    const url = parseApiURL(path);
    return axios.put<IApiResponse<T>>(url, payload, {
      headers: { Authorization: this.getToken() },
    });
  }

  async patch<T>(path: string, payload?: { [key: string]: any }) {
    const url = parseApiURL(path);
    return axios.patch<IApiResponse<T>>(url, payload, {
      headers: { Authorization: this.getToken() },
    });
  }

  async delete<T>(path: string, searchParams?: { [key: string]: any }) {
    const url = parseApiURL(path, searchParams);
    return axios.delete<IApiResponse<T>>(url, {
      headers: { Authorization: this.getToken() },
    });
  }
}

export const API = new ApiService();

export const apiPath = (root: string) => {
  if (root.startsWith('/')) root = root.substring(1);
  return (path?: string) => {
    if (path?.startsWith('/')) path = path?.substring(1);
    return `${root}${path ? `/${path}` : ''}`;
  };
};
