import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Topic } from '@/types';
import { useTopicStore } from '@/store/topicStore';

interface TopicCardProps {
  topic: Topic;
  onClick?: () => void;
  onDelete?: () => void;
}

export function TopicCard({ topic, onClick, onDelete }: TopicCardProps) {
  const { deleteTopic } = useTopicStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: topic.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete();
    } else {
      deleteTopic(topic.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 relative group"
    >
      <div 
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-grab active:cursor-grabbing"
      >
        <GripVertical size={16} />
      </div>
      <h3 
        className="text-lg font-semibold text-white mb-2 pl-6 cursor-pointer hover:text-primary transition-colors"
        onClick={onClick}
      >
        {topic.title}
      </h3>
      {topic.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm pl-6 mb-2">
          {topic.description}
        </p>
      )}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200 opacity-0 group-hover:opacity-100"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

export default TopicCard;