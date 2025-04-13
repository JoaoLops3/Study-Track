import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import { Topic } from '../types';
import { useStudyStore } from '../store';
import { useAuthStore } from '../store/authStore';
import { TopicForm } from './TopicForm';
import { Column } from './Column';
import { TopicModal } from './TopicModal';
import { TopicCard } from './TopicCard';
import { Calculator } from './Calculator';
import { PomodoroTimer } from './PomodoroTimer';
import { StudyStats } from './StudyStats';
import { AccessibilityControls } from './AccessibilityControls';
import { PomodoroStats } from './PomodoroStats';
import { ScholarSearch } from './ScholarSearch';
import { LogOut, User, Settings, Bell } from 'lucide-react';
import logo from '@/assets/study-track-logo.png';

export const Dashboard = () => {
  const navigate = useNavigate();
  const topics = useStudyStore((state) => state.topics);
  const fetchTopics = useStudyStore((state) => state.fetchTopics);
  const updateTopicStatus = useStudyStore((state) => state.updateTopicStatus);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const { user, logout } = useAuthStore();

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const columns = [
    { id: 'toStudy', title: 'Para Estudar' },
    { id: 'studying', title: 'Estudando' },
    { id: 'studied', title: 'Estudado' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
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

    setActiveTopic(null);
  };

  const getTopicsByStatus = (status: Topic['status']) => {
    return topics.filter(topic => topic.status === status);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark p-8">
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img
              src={logo}
              alt="Study Track Logo"
              className="h-10 w-10"
            />
            <h1 className="text-3xl font-bold text-primary dark:text-white">Study Track</h1>
          </div>
          <div className="flex gap-4 items-center">
            <ScholarSearch />
            <AccessibilityControls />
            <Calculator />
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <User size={20} />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <PomodoroTimer onActiveChange={setIsPomodoroActive} />
          <StudyStats isPomodoroActive={isPomodoroActive} />
        </div>

        <div className="mb-8">
          <PomodoroStats />
        </div>

        <div className="flex gap-8 h-[calc(100vh-20rem)]">
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
              {activeTopic && (
                <TopicCard
                  topic={activeTopic}
                  onClick={() => {}}
                />
              )}
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
}; 