import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Topic } from '../types';
import { TopicCard } from './TopicCard';

interface ColumnProps {
  id: string;
  title: string;
  topics: Topic[];
  onTopicClick: (topic: Topic) => void;
}

export const Column = ({ id, title, topics, onTopicClick }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{title}</h2>
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-4 bg-[#d2ced2] dark:bg-gray-800 rounded-lg"
      >
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
  );
};