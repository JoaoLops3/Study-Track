import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { TopicCard } from './TopicCard';
import { Topic } from '@/types';

interface ColumnProps {
  id: string;
  title: string;
  topics: Topic[];
  onTopicClick?: (topic: Topic) => void;
  onTopicDelete?: (topic: Topic) => void;
}

export function Column({ id, title, topics, onTopicClick, onTopicDelete }: ColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  const handleTopicClick = (topic: Topic) => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  const handleTopicDelete = (topic: Topic) => {
    if (onTopicDelete) {
      onTopicDelete(topic);
    }
  };

  return (
    <div
      ref={setNodeRef}
      className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg min-h-[500px]"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="space-y-4">
        {topics.map((topic) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onClick={() => handleTopicClick(topic)}
            onDelete={() => handleTopicDelete(topic)}
          />
        ))}
      </div>
    </div>
  );
} 