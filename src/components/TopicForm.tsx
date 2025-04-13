import { useState } from 'react';
import { useStudyStore } from '../store';
import { Topic } from '../types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TopicCard } from './TopicCard';
import { PlusCircle } from 'lucide-react';

interface TopicFormProps {
  onTopicClick: (topic: Topic) => void;
}

export const TopicForm = ({ onTopicClick }: TopicFormProps) => {
  const [title, setTitle] = useState('');
  const addTopic = useStudyStore((state) => state.addTopic);
  const topics = useStudyStore((state) => state.topics.filter(topic => topic.status === 'new'));
  const { setNodeRef } = useDroppable({ id: 'new' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTopic({
        title: title.trim(),
        summary: '',
        status: 'new'
      });
      setTitle('');
    }
  };

  return (
    <div className="bg-[#d2ced2] dark:bg-gray-800 rounded-lg shadow flex flex-col h-full">
      <div className="p-4 border-b border-gray-300 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-primary dark:text-white">Adicionar Novo Tópico</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Título do Tópico
            </label>
            <input
              id="topic"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do tópico..."
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
          >
            <PlusCircle size={20} />
            Adicionar Tópico
          </button>
        </form>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Novos Tópicos</h3>
        <div ref={setNodeRef} className="space-y-2 overflow-y-auto h-full">
          <SortableContext
            items={topics.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => onTopicClick(topic)}
              />
            ))}
          </SortableContext>
        </div>
      </div>
    </div>
  );
};