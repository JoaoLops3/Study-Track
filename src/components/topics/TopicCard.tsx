import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, FileText, X } from 'lucide-react';
import { Topic } from '@/types';
import { useTopicStore } from '@/store/topicStore';

interface TopicCardProps {
  topic: Topic;
  onClick?: () => void;
  onDelete?: () => void;
}

export function TopicCard({ topic, onClick, onDelete }: TopicCardProps) {
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
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

  const handleTitleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (topic.summary) {
      setIsSummaryModalOpen(true);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={handleCardClick}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200 relative"
      >
        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">
          <GripVertical size={16} />
        </div>
        <div 
          onClick={handleTitleClick}
          className={`cursor-pointer ${topic.summary ? 'hover:text-blue-600 dark:hover:text-blue-400' : ''}`}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 pl-6">
            {topic.title}
          </h3>
        </div>
        {topic.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm pl-6 mb-2">
            {topic.description}
          </p>
        )}
        {topic.summary && (
          <div className="flex items-start gap-2 pl-6 mb-2">
            <FileText size={16} className="text-gray-400 mt-1 flex-shrink-0" />
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">
              {topic.summary}
            </p>
          </div>
        )}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {isSummaryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-700 rounded-lg w-full max-w-2xl text-white">
            <div className="p-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-600">
                <h2 className="text-xl font-semibold">{topic.title}</h2>
                <button
                  onClick={() => setIsSummaryModalOpen(false)}
                  className="p-1 hover:bg-gray-600 rounded-full text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-4 p-4">
                <p className="text-gray-300 whitespace-pre-wrap">{topic.summary}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TopicCard;