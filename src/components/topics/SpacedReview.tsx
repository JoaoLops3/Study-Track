import React, { useMemo } from 'react';
import { Topic } from '../types/Topic';
import { Brain, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';

interface SpacedReviewProps {
  topics: Topic[];
  onUpdateReview: (topicId: string, confidence: number) => void;
}

export const SpacedReview: React.FC<SpacedReviewProps> = ({ topics, onUpdateReview }) => {
  const topicsToReview = useMemo(() => {
    const today = new Date();
    return topics
      .filter(topic => {
        if (!topic.nextReviewDate) return false;
        return new Date(topic.nextReviewDate) <= today;
      })
      .sort((a, b) => {
        const dateA = new Date(a.nextReviewDate || 0);
        const dateB = new Date(b.nextReviewDate || 0);
        return dateA.getTime() - dateB.getTime();
      });
  }, [topics]);

  const handleConfidenceUpdate = (topicId: string, confidence: number) => {
    onUpdateReview(topicId, confidence);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Não definida';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 4) return 'text-green-500';
    if (confidence >= 2) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="w-6 h-6 text-primary dark:text-white" />
        <h2 className="text-xl font-semibold text-primary dark:text-white">
          Revisão Espaçada
        </h2>
      </div>

      {topicsToReview.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Nenhum tópico para revisar hoje!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topicsToReview.map(topic => (
            <div
              key={topic.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Última revisão: {topic.lastStudySession ? formatDate(topic.lastStudySession) : 'Nunca'}
                  </p>
                </div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <button
                      key={level}
                      onClick={() => handleConfidenceUpdate(topic.id, level)}
                      className={`px-4 py-2 rounded-lg transition-colors
                        ${level <= 2 ? 'bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800' :
                          level <= 4 ? 'bg-yellow-100 dark:bg-yellow-900 hover:bg-yellow-200 dark:hover:bg-yellow-800' :
                          'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800'}`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {topic.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 