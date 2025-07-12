import axios from 'axios';

/*
 * Axios instance that automatically attaches JWT from localStorage.
 * Set VITE_API_BASE_URL in .env to control backend URL; defaults to localhost.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
});

import type { InternalAxiosRequestConfig } from 'axios';

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
