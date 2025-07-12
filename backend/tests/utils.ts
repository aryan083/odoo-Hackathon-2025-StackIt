import request from 'supertest';
import app from '../src/app.ts';

export const registerUser = async (username: string, email: string, password = 'pass1234') => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username, email, password });
  return res;
};

export const loginUser = async (email: string, password = 'pass1234') => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  return res;
};

export const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

import { User } from '../src/models/User.ts';

export const promoteToAdmin = async (email: string): Promise<void> => {
  await User.updateOne({ email }, { role: 'ADMIN' });
};

export const createQuestion = async (token: string, overrides?: Partial<{title:string;body:string;tags:string[]}>) => {
  const payload = {
    title: 'Sample question',
    body: 'This is a sample question body content',
    tags: ['test'],
    ...overrides,
  };
  const res = await request(app)
    .post('/api/questions')
    .set(authHeader(token))
    .send(payload);
  return res;
};
