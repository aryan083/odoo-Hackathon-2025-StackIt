import { api } from './client';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export const getMe = async (): Promise<User> => {
  const res = await api.get<{ user: User }>('/users/me');
  return res.data.user;
};
