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
    transition: transition || 'transform 200ms ease',
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTopic(topic.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing bg-white dark:bg-gray-800 hover:shadow-lg transition-all duration-200 ${
        isDragging ? 'opacity-50 ring-2 ring-primary' : ''
      }`}
      onClick={onClick}
      {...attributes}
      {...listeners}
      role="button"
      aria-label={`Arrastar tópico: ${topic.title}`}
      tabIndex={0}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
          <h3 className="text-lg font-medium text-primary dark:text-white">
            {topic.title}
          </h3>
        </div>
        <button
          onClick={handleDelete}
          className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
          aria-label={`Excluir tópico: ${topic.title}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TopicCard;