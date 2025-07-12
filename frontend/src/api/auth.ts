import { api } from './client';

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
  };
}

export const login = async (email: string, password: string) => {
  const res = await api.post<LoginResponse>('/auth/login', { email, password });
  return res.data;
};

export const signup = async (username: string, email: string, password: string) => {
  const res = await api.post<LoginResponse>('/auth/register', { username, email, password });
  return res.data;
};
