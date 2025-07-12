import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import Tiptap from "../components/TipTap";
import { 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle, 
  User, 
  Calendar,
  Tag,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  ArrowLeft
} from "lucide-react";
import data from "../data.json";

interface Answer {
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

interface Question {
  id: string;
  title: string;
  body: string;
  tags: string[];
  author: {
    id: string;
    username: string;
  };
  createdAt: string;
  votes: number;
}

export default function QuestionDetail() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setQuestion(data.question);
      setAnswers(data.answers);
      setLoading(false);
    }, 500);
  }, [questionId]);

  const handleSubmitAnswer = async () => {
    // Simulate adding a new answer
    const newAnswerObj: Answer = {
      id: `answer${Date.now()}`,
      body: newAnswer,
      author: {
        id: "currentUser",
        username: "current_user"
      },
      createdAt: new Date().toISOString(),
      votes: 0,
      isAccepted: false
    };

    setAnswers([...answers, newAnswerObj]);
    setNewAnswer("");
    setShowAnswerForm(false);
  };

  const handleVote = async (answerId: string, vote: 1 | -1) => {
    // Simulate voting
    setAnswers(answers.map(answer => 
      answer.id === answerId 
        ? { ...answer, votes: answer.votes + vote }
        : answer
    ));
  };

  const handleAcceptAnswer = async (answerId: string) => {
    // Simulate accepting answer
    setAnswers(answers.map(answer => ({
      ...answer,
      isAccepted: answer.id === answerId
    })));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">Question not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex items-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        </div>

        {/* Question Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Voting */}
            <div className="flex flex-col items-center gap-3">
              <button className="p-3 hover:bg-blue-50 hover:border-blue-300 rounded-lg transition-all duration-200 border border-gray-200 hover:shadow-md">
                <ArrowUp size={20} className="text-gray-600 hover:text-blue-600 transition-colors" />
              </button>
              <span className="text-xl font-bold text-gray-800">{question.votes}</span>
              <button className="p-3 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 border border-gray-200 hover:shadow-md">
                <ArrowDown size={20} className="text-gray-600 hover:text-red-600 transition-colors" />
              </button>
            </div>

            {/* Question Content */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">{question.title}</h1>
              
              {/* Question Body */}
              <div className="prose max-w-none mb-8 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: question.body }} />
              
              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {question.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#165cfa]/10 text-[#165cfa] rounded-full text-sm font-medium border border-[#165cfa]/20 hover:bg-[#165cfa]/20 hover:border-[#165cfa]/30 transition-all duration-200"
                  >
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* Question Meta */}
              <div className="flex items-center justify-between text-sm text-gray-600 border-t border-gray-200 pt-6">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-500" />
                    <span className="font-medium">{question.author.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-500" />
                    <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-gray-500" />
                  <span className="font-medium">{answers.length} answers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <MessageSquare size={24} className="text-[#165cfa]" />
            {answers.length} Answer{answers.length !== 1 ? 's' : ''}
          </h2>

          <div className="space-y-6">
            {answers.map((answer, index) => (
              <div key={answer.id} className={`bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ${answer.isAccepted ? 'ring-2 ring-green-200 bg-green-50/30' : ''}`}>
                <div className="flex items-start gap-6">
                  {/* Voting */}
                  <div className="flex flex-col items-center gap-3">
                    <button 
                      onClick={() => handleVote(answer.id, 1)}
                      className="p-3 hover:bg-green-50 hover:border-green-300 rounded-lg transition-all duration-200 border border-gray-200 hover:shadow-md"
                    >
                      <ArrowUp size={20} className="text-gray-600 hover:text-green-600 transition-colors" />
                    </button>
                    <span className="text-xl font-bold text-gray-800">{answer.votes}</span>
                    <button 
                      onClick={() => handleVote(answer.id, -1)}
                      className="p-3 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-200 border border-gray-200 hover:shadow-md"
                    >
                      <ArrowDown size={20} className="text-gray-600 hover:text-red-600 transition-colors" />
                    </button>
                    {answer.isAccepted && (
                      <div className="mt-2 p-2 bg-green-100 rounded-full">
                        <CheckCircle size={24} className="text-green-600" />
                      </div>
                    )}
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1">
                    <div className="prose max-w-none mb-6 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: answer.body }} />
                    
                    {/* Answer Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-500" />
                          <span className="font-medium">{answer.author.username}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-500" />
                          <span>{new Date(answer.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {!answer.isAccepted && question.author.id === "user1" && (
                        <button
                          onClick={() => handleAcceptAnswer(answer.id)}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium border border-green-200 px-4 py-2 rounded-lg hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                        >
                          <CheckCircle size={16} />
                          Accept Answer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Answer Button */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              onClick={() => setShowAnswerForm(true)}
              className="bg-[#165cfa] text-white hover:bg-[#165cfa]/90 border border-[#165cfa] px-6 py-3 text-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              <MessageSquare size={20} className="mr-2" />
              Add Answer
            </Button>
          </div>
        </div>

        {/* Answer Form */}
        {showAnswerForm && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Your Answer</h3>
            <div className="mb-6">
              <Tiptap />
            </div>
            <div className="flex gap-4">
              <Button
                onClick={handleSubmitAnswer}
                className="bg-[#165cfa] text-white hover:bg-[#165cfa]/90 border border-[#165cfa] px-6 py-3 text-lg font-medium transition-all duration-200 hover:shadow-lg"
              >
                Post Answer
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAnswerForm(false)}
                className="border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 px-6 py-3 text-lg font-medium transition-all duration-200"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 