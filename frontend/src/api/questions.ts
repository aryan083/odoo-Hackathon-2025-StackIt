import { api } from './client';

interface RawVote { user: string; value: 1 | -1 }

export interface Question {
  /** Original MongoDB id */
  _id: string;
  /** Convenience alias for the id used by UI components */
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: { _id: string; username: string };
  /** Optional votes field – backend currently has no votes for question, default 0 */
  votes: number;
  createdAt: string;
}

export const createQuestion = async (title: string, body: string, tags: string[]) => {
  const res = await api.post<{ question: Question }>('/questions', {
    title,
    body,
    tags,
  });
  const q = res.data.question;
  return { ...q, id: q._id } as Question;
};

/** Get full details for a single question */
export const getQuestion = async (questionId: string): Promise<Question> => {
  const res = await api.get<{ question: Question }>(`/questions/${questionId}`);
  const q = res.data.question;
  // Ensure the alias id field exists so components can rely on `id`
  const tally = ((q as any).votes ?? []) as RawVote[];
  const votes = tally.reduce((sum, v) => sum + v.value, 0);
  return {
    ...q,
    id: q._id,
    votes,
  } as Question;
};

/** Vote on a question, returns new vote tally */
export const voteQuestion = async (questionId: string, vote: 1 | -1): Promise<number> => {
  const res = await api.post<{ votes: RawVote[] }>(`/questions/${questionId}/vote`, { vote });
  return res.data.votes.reduce((sum, v) => sum + v.value, 0);
};
