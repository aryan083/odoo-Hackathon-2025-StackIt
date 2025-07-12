import { api } from './client';

export interface Question {
  _id: string;
  title: string;
  body: string;
  tags: string[];
  author: { _id: string; username: string };
}

export const createQuestion = async (title: string, body: string, tags: string[]) => {
  const res = await api.post<{ question: Question }>('/questions', {
    title,
    body,
    tags,
  });
  return res.data.question;
};
