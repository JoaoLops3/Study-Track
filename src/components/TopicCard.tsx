import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { Topic } from '../types';
import { useStudyStore } from '../store';

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
}

export function TopicCard({ topic, onClick }: TopicCardProps) {
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
      className={`bg-blue-800 p-4 rounded-lg shadow-md mb-2 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab hover:text-gray-300 touch-none text-gray-400"
        >
          <GripVertical size={20} />
        </button>
        <h3 
          className="font-medium cursor-pointer text-white hover:text-blue-200 flex-1"
          onClick={onClick}
        >
          {topic.title}
        </h3>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-400 transition-colors"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}