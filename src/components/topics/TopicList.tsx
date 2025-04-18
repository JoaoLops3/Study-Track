import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TopicCard from './TopicCard';
import { useTopicStore } from '@/store/topicStore';
import { TopicModal } from './TopicModal';
import { Topic } from '@/types';

const TopicList: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  
  const { topics, addTopic, updateTopicStatus, deleteTopic } = useTopicStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = topics.findIndex((item) => item.id === active.id);
      const newIndex = topics.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newTopics = arrayMove(topics, oldIndex, newIndex);
        // Atualizar a ordem no banco de dados
        newTopics.forEach((topic, index) => {
          if (topic.id !== topics[index].id) {
            updateTopicStatus(topic.id, topic.status);
          }
        });
      }
    }
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeTopic = topics.find(t => t.id === active.id);
    const overTopic = topics.find(t => t.id === over.id);

    if (activeTopic && overTopic && activeTopic.status !== overTopic.status) {
      updateTopicStatus(activeTopic.id, overTopic.status);
    }
  };

  const handleTopicClick = (topic: Topic) => {
    setSelectedTopic(topic);
  };

  const handleDeleteTopic = async (topicId: string) => {
    await deleteTopic(topicId);
  };

  const handleAddTopic = async () => {
    if (newTopicTitle.trim()) {
      await addTopic({
        title: newTopicTitle.trim(),
        status: 'toStudy'
      });
      setNewTopicTitle('');
      setIsModalOpen(false);
    }
  };

  const activeTopic = activeId ? topics.find(topic => topic.id === activeId) : null;

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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          <SortableContext
            items={topics.map(topic => topic.id)}
            strategy={verticalListSortingStrategy}
          >
            {topics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => handleTopicClick(topic)}
                onDelete={() => handleDeleteTopic(topic.id)}
              />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTopic ? (
            <TopicCard
              topic={activeTopic}
              onClick={() => handleTopicClick(activeTopic)}
              onDelete={() => handleDeleteTopic(activeTopic.id)}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Adicionar Novo Tópico</h3>
            <input
              type="text"
              value={newTopicTitle}
              onChange={(e) => setNewTopicTitle(e.target.value)}
              placeholder="Título do tópico"
              className="w-full p-2 mb-4 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddTopic}
                className="px-4 py-2 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary/90 dark:hover:bg-primary-dark/90"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTopic && (
        <TopicModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
        />
      )}
    </div>
  );
};

export default TopicList; 