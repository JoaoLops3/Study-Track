import React, { useState } from 'react';
import { Topic as TopicType } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TopicForm } from './TopicForm';
import { useStudyStore } from '../store/studyStore';
import { format } from 'date-fns';

interface TopicProps {
  topic: TopicType;
}

export const Topic: React.FC<TopicProps> = ({ topic }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { addReview, getNextReviewDate } = useStudyStore();

  const nextReviewDate = getNextReviewDate(topic.reviewHistory);
  const isReviewDue = nextReviewDate && nextReviewDate <= new Date();
  const lastConfidence = topic.reviewHistory.length > 0 ? topic.reviewHistory[topic.reviewHistory.length - 1].confidence : null;

  const handleReview = (confidence: number) => {
    addReview(topic.id, confidence);
  };

  const getConfidenceColor = (level: number) => {
    const colors = {
      1: 'bg-red-500',
      2: 'bg-orange-500',
      3: 'bg-yellow-500',
      4: 'bg-green-500',
      5: 'bg-blue-500'
    };
    return colors[level as keyof typeof colors];
  };

  return (
    <div className="card relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{topic.title}</h3>
        {isReviewDue && (
          <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 text-xs px-2 py-1 rounded">
            Revisão Pendente
          </span>
        )}
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 mb-4">{topic.description}</p>
      
      <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-gray-400">
        <p>Tempo estudado: {Math.round(topic.timeSpent / 60)} minutos</p>
        {nextReviewDate && (
          <p>
            Próxima revisão: {
              formatDistanceToNow(nextReviewDate, { 
                addSuffix: true,
                locale: ptBR 
              })
            }
          </p>
        )}
        {lastConfidence && (
          <p>Último nível de confiança: {lastConfidence}</p>
        )}
      </div>

      <div className="border-t dark:border-gray-700 pt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Próxima revisão: {nextReviewDate ? format(nextReviewDate, "dd 'de' MMMM', às' HH:mm", { locale: ptBR }) : 'Não agendada'}
        </p>
        
        <div className="flex flex-col space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nível de confiança:</p>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <button
                key={level}
                onClick={() => handleReview(level)}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-white
                  ${getConfidenceColor(level)}
                  ${lastConfidence === level ? 'ring-2 ring-offset-2' : ''}
                  hover:opacity-90 transition-opacity
                `}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsReviewModalOpen(true)}
        className="mt-4 btn-primary w-full"
      >
        Revisar Tópico
      </button>

      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Revisar Tópico: {topic.title}</h2>
            <TopicForm
              isReview
              topicId={topic.id}
              onSubmit={() => setIsReviewModalOpen(false)}
            />
            <button
              onClick={() => setIsReviewModalOpen(false)}
              className="mt-4 btn-secondary w-full"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 