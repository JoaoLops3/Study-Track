import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Topic } from '@/types';
import { TopicCard } from '@/components/topics/TopicCard';

interface ColumnProps {
  id: string;
  title: string;
  topics: Topic[];
  onTopicClick: (topic: Topic) => void;
}

export const Column = ({ id, title, topics, onTopicClick }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ 
    id,
    data: {
      type: 'column',
      columnId: id
    }
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-4 rounded-lg transition-colors duration-200 ${
          isOver 
            ? 'bg-primary/10 dark:bg-primary-dark/10 ring-2 ring-primary dark:ring-primary-dark' 
            : 'bg-[#d2ced2] dark:bg-gray-800'
        }`}
      >
        <SortableContext
          items={topics.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => onTopicClick(topic)}
              />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};