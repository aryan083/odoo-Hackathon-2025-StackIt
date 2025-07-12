import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import QuestionList from './QuestionList';

const MainContent: React.FC = () => {
  return (
    <div className="py-4 bg-white border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Questions</h1>

          <div className="flex items-center gap-4">
            <select
              className="py-2.5 px-4 border border-gray-300 bg-white rounded-lg text-sm focus:border-blue-600 focus:ring-blue-600 dark:bg-neutral-900 dark:border-neutral-700 dark:text-white"
              defaultValue="newest"
            >
              <option value="newest">Newest</option>
              <option value="unanswered">Unanswered</option>
              <option value="votes">Most Voted</option>
            </select>

            <Link
              to="/create-post"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 text-sm font-medium rounded-lg shadow-sm transition"
            >
              <Plus size={16} />
              Ask Question
            </Link>
          </div>
        </div>

        <div className="py-6">
          <QuestionList />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
