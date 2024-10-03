import { ENV } from '@/environments/env';
import axios from 'axios';

export function parseApiURL(path: string, searchParams?: any) {
  const url = URL.parse(`${ENV.SERVER_URL}/api/${path}`);
  if (!url) {
    throw Error("Can't parse URL.");
  }

  if (searchParams) {
    const urlSearch = new URLSearchParams();
    for (const key in searchParams) {
      if (Array.isArray(searchParams[key])) {
        for (const value of searchParams[key]) {
          urlSearch.append(key, value);
        }
      } else {
        urlSearch.append(key, searchParams[key]);
      }
    }
    url.search = new URLSearchParams(searchParams).toString();
  }
  return url.href.startsWith('http') ? url.href : `http://${url.href}`;
}

class ApiService {
  async get<T>(path: string, searchParams?: { [key: string]: any }) {
    const url = parseApiURL(path, searchParams);
    return axios.get<T>(url);
  }

  async post<T>(path: string, payload?: { [key: string]: any }) {
    const url = parseApiURL(path);
    return axios.post<T>(url, payload);
  }

  async put<T>(path: string, payload?: { [key: string]: any }) {
    const url = parseApiURL(path);
    return axios.put<T>(url, payload);
  }

  async patch<T>(path: string, payload?: { [key: string]: any }) {
    const url = parseApiURL(path);
    return axios.patch<T>(url, payload);
  }

  async delete<T>(path: string, searchParams?: { [key: string]: any }) {
    const url = parseApiURL(path, searchParams);
    return axios.delete<T>(url);
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
