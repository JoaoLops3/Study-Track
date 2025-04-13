import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TopicCard from './TopicCard';

interface Topic {
  id: string;
  title: string;
}

const TopicList: React.FC = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTopics((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleTopicClick = (topic: Topic) => {
    // Implementar navegação para o tópico
    console.log('Topic clicked:', topic);
  };

  const handleDeleteTopic = (topicId: string) => {
    setTopics(topics.filter(topic => topic.id !== topicId));
  };

  const handleAddTopic = () => {
    if (newTopicTitle.trim()) {
      const newTopic: Topic = {
        id: Date.now().toString(),
        title: newTopicTitle.trim(),
      };
      setTopics([...topics, newTopic]);
      setNewTopicTitle('');
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-primary dark:text-white">Tópicos</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
        >
          Adicionar Tópico
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={topics.map(topic => topic.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {topics.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => handleTopicClick(topic)}
                onDelete={() => handleDeleteTopic(topic.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-card dark:bg-card-dark p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-semibold text-primary dark:text-white mb-4">
              Novo Tópico
            </h3>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Digite o título do tópico"
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTopic}
                className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary/90 dark:hover:bg-primary-dark/90 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopicList; 