import { api } from './client';

export interface Answer {
  id: string;
  body: string;
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  votes: number;
  isAccepted: boolean;
}

/** Map backend answer document to front-end friendly shape */
function mapAnswer(raw: any): Answer {
  return {
    id: raw._id,
    body: raw.body,
    author: {
      id: raw.author?._id ?? (typeof raw.author === 'string' ? raw.author : ''),
      username: raw.author?.username ?? 'unknown',
    },
    createdAt: raw.createdAt ?? new Date().toISOString(),
    votes: Array.isArray(raw.votes)
      ? raw.votes.reduce((sum: number, v: { value: number }) => sum + v.value, 0)
      : typeof raw.votes === 'number'
      ? raw.votes
      : 0,
    isAccepted: raw.isAccepted ?? false,
  };
}

export const listAnswers = async (questionId: string): Promise<Answer[]> => {
  const res = await api.get<{ answers: any[] }>(`/questions/${questionId}/answers`);
  return res.data.answers.map(mapAnswer);
};

export const addAnswer = async (questionId: string, body: string): Promise<Answer> => {
  const res = await api.post<{ answer: any }>(`/questions/${questionId}/answers`, { body });
  return mapAnswer(res.data.answer);
};

export const voteAnswer = async (
  questionId: string,
  answerId: string,
  vote: 1 | -1
): Promise<void> => {
  await api.post(`/questions/${questionId}/answers/${answerId}/vote`, { vote });
};

export const acceptAnswer = async (questionId: string, answerId: string): Promise<void> => {
  await api.post(`/questions/${questionId}/answers/${answerId}/accept`);
};
