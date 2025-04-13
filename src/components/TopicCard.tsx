import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Topic } from '../types';
import { useStudyStore } from '../store';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
  onDelete: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, onClick, onDelete }) => {
  const deleteTopic = useStudyStore((state) => state.deleteTopic);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: topic.id,
    data: {
      type: 'Topic',
      topic,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTopic(topic.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg shadow-md cursor-pointer bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-primary dark:text-white">
          {topic.title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="text-gray-500 hover:text-red-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopicCard;