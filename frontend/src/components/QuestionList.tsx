import React, { useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  body: string;
  username: string;
  tags: string[];
  votes: number;
  answers: number;
}

// TODO: Replace mock data with API data once backend exists
const mockQuestions: Question[] = [
    {
    id: 1,
    title: 'How to optimize React application performance?',
    body: 'I have a large React app and notice performance issues on re-renders. What best practices or tools can I use to profile and optimize it?',
    username: 'alice',
    tags: ['react', 'performance', 'javascript'],
    votes: 12,
    answers: 3,
  },
    {
    id: 2,
    title: 'What is the best way to handle state management in large applications?',
    body: 'We are scaling our app and Redux feels verbose. Are there modern alternatives or patterns for simpler state management?',
    username: 'bob',
    tags: ['state-management', 'redux', 'context-api'],
    votes: 8,
    answers: 1,
  },
    {
    id: 3,
    title: 'Difference between interface and type in TypeScript?',
    body: 'Could someone explain when to use interface vs type aliases, especially for complex types?',
    username: 'charlie',
    tags: ['typescript', 'types', 'interfaces'],
    votes: 15,
    answers: 5,
  },
  {
    id: 4,
    title: 'Difference between interface and type in TypeScript?',
    body: 'Could someone explain when to use interface vs type aliases, especially for complex types?',
    username: 'charlie',
    tags: ['typescript', 'types', 'interfaces'],
    votes: 15,
    answers: 5,
  },
  {
    id: 5,
    title: 'Difference between interface and type in TypeScript?',
    body: 'Could someone explain when to use interface vs type aliases, especially for complex types?',
    username: 'charlie',
    tags: ['typescript', 'types', 'interfaces'],
    votes: 15,
    answers: 5,
  },
];

interface QuestionListProps {
  searchTerm?: string;
}

const QuestionList: React.FC<QuestionListProps> = ({ searchTerm = '' }) => {
  const filteredQuestions = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return mockQuestions;
    return mockQuestions.filter((q) =>
      (q.title + ' ' + q.body + ' ' + q.tags.join(' '))
        .toLowerCase()
        .includes(term)
    );
  }, [searchTerm]);
  return (
    <div className="space-y-6">
      {filteredQuestions.map((q) => (
        <div
          key={q.id}
          className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg p-4 hover:shadow-md transition max-w-5xl mx-auto"
        >
          <div className="flex gap-6">
            {/* Voting */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              {/* Upvote */}
              <button className="p-2 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/30 transition-all duration-200">
                <ArrowUp size={16} className="text-gray-500" />
              </button>
              <span className="text-sm font-semibold text-gray-800 dark:text-white">{q.votes}</span>
              <button className="p-2 border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/30 transition-all duration-200">
                <ArrowDown size={16} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-1">
              <a
                href={`/question/${q.id}`}
                className="text-lg font-semibold text-black hover:underline"
              >
                {q.title}
              </a>
              <p className="mt-1 text-sm text-gray-700 dark:text-neutral-300 line-clamp-2">
                {q.body}
              </p>
              
            </div>

            {/* Stats + Username */}
            <div className="flex flex-col items-end text-sm text-gray-600 dark:text-neutral-300 min-w-[110px]">
              <div className="flex gap-4">
                <span>{q.votes} votes</span>
                <span> <b> {q.answers} answers</b> </span>
              </div>
              <span className="mt-1 text-xs text-gray-500 dark:text-neutral-400">asked by {q.username}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {q.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
