import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useStudyStore } from '../store';
import { Topic } from '../types';
import { TopicCard } from './TopicCard';

interface TopicFormProps {
  onTopicClick: (topic: Topic) => void;
}

export function TopicForm({ onTopicClick }: TopicFormProps) {
  const [title, setTitle] = useState('');
  const addTopic = useStudyStore((state) => state.addTopic);
  const topics = useStudyStore((state) => state.topics.filter(topic => topic.status === 'new'));
  const { setNodeRef } = useDroppable({ id: 'new' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      addTopic(title.trim());
      setTitle('');
    }
  };

  return (
    <div className="bg-gray-700 rounded-lg shadow flex flex-col h-full">
      <div className="p-4 border-b border-gray-600">
        <h2 className="text-lg font-semibold mb-4 text-white">Adicionar Novo Tópico</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-1">
              Título do Tópico
            </label>
            <input
              id="topic"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do tópico..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} />
            Adicionar Tópico
          </button>
        </form>
      </div>

      <div className="flex-1 p-4 overflow-hidden">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Novos Tópicos</h3>
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
}