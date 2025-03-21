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

export function Column({ id, title, topics, onTopicClick }: ColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col bg-gray-700 p-4 rounded-lg h-full">
      <h2 className="text-lg font-semibold mb-4 text-white">{title}</h2>
      <div ref={setNodeRef} className="flex-1 overflow-y-auto">
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
}