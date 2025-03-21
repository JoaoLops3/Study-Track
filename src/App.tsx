import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import { Topic } from './types';
import { useStudyStore } from './store';
import { TopicForm } from './components/TopicForm';
import { Column } from './components/Column';
import { TopicModal } from './components/TopicModal';
import { TopicCard } from './components/TopicCard';
import { Calculator } from './components/Calculator';

function App() {
  const topics = useStudyStore((state) => state.topics);
  const updateTopicStatus = useStudyStore((state) => state.updateTopicStatus);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);

  const columns = [
    { id: 'toStudy', title: 'Para Estudar' },
    { id: 'studying', title: 'Estudando' },
    { id: 'studied', title: 'Estudado' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    setActiveTopic(topics.find((t) => t.id === active.id) || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeTopicId = active.id as string;
      const overColumnId = over.id as string;
      
      if ([...columns.map(col => col.id), 'new'].includes(overColumnId)) {
        updateTopicStatus(activeTopicId, overColumnId as Topic['status']);
      }
    }
    
    setActiveId(null);
    setActiveTopic(null);
  };

  const getTopicsByStatus = (status: Topic['status']) => {
    return topics.filter(topic => topic.status === status);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Study Track</h1>
          <Calculator />
        </div>
        
        <div className="flex gap-8 h-[calc(100vh-8rem)]">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            <div className="w-80">
              <TopicForm onTopicClick={setSelectedTopic} />
            </div>
            
            <div className="flex gap-8 flex-1">
              {columns.map((column) => (
                <div key={column.id} className="flex-1">
                  <Column
                    id={column.id}
                    title={column.title}
                    topics={getTopicsByStatus(column.id as Topic['status'])}
                    onTopicClick={setSelectedTopic}
                  />
                </div>
              ))}
            </div>

            <DragOverlay>
              {activeTopic ? (
                <TopicCard
                  topic={activeTopic}
                  onClick={() => {}}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>

        {selectedTopic && (
          <TopicModal
            topic={selectedTopic}
            onClose={() => setSelectedTopic(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;