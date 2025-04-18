import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core';
import { useTopicStore } from '@/store/topicStore';
import { useAuthStore } from '@/store/authStore';
import { TopicForm } from '@/components/topics/TopicForm';
import { Column } from '@/components/shared/Column';
import { TopicModal } from '@/components/topics/TopicModal';
import { TopicCard } from '@/components/topics/TopicCard';
import { Calculator } from '@/components/shared/Calculator';
import { PomodoroTimer } from '@/components/pomodoro/PomodoroTimer';
import { AccessibilityControls } from '@/components/shared/AccessibilityControls';
import { ScholarSearch } from '@/components/shared/ScholarSearch';
import { LogOut, User, Settings, Bell, BarChart2, Calendar as CalendarIcon } from 'lucide-react';
import logo from '@/assets/study-track-logo.png';
import { useTheme } from '@/contexts/ThemeContext';
import { Topic } from '@/types';

export function Dashboard() {
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuthStore();
  const { isDarkMode } = useTheme();
  const { topics, updateTopicStatus } = useTopicStore((state) => ({
    topics: state.topics,
    updateTopicStatus: state.updateTopicStatus
  }));

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuthenticated = await checkAuth();
        if (!isAuthenticated) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        navigate('/login');
      }
    };

    verifyAuth();
  }, [checkAuth, navigate]);

  const columns = [
    { id: 'toStudy', title: 'Para Estudar' },
    { id: 'studying', title: 'Estudando' },
    { id: 'studied', title: 'Estudado' },
  ];

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const topic = topics.find((t) => t.id === active.id);
    if (topic) {
      setActiveTopic(topic);
    }
  }, [topics]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeTopicId = active.id as string;
      const overColumnId = over.id as string;
      
      if ([...columns.map(col => col.id), 'new'].includes(overColumnId)) {
        updateTopicStatus(activeTopicId, overColumnId as Topic['status']);
      }
    }

    setActiveTopic(null);
  }, [columns, updateTopicStatus]);

  const getTopicsByStatus = useCallback((status: Topic['status']) => {
    return topics.filter(topic => topic.status === status);
  }, [topics]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }, [logout, navigate]);

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
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
            <button
              onClick={() => navigate('/dashboard/calendar')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
              aria-label="Ir para o calendário"
            >
              <CalendarIcon size={20} />
              Calendário
            </button>
            <button
              onClick={() => navigate('/dashboard/statistics')}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
              aria-label="Ir para estatísticas"
            >
              <BarChart2 size={20} />
              Estatísticas
            </button>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <User size={20} />
              <span>Olá, {user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors duration-200"
              aria-label="Sair da aplicação"
            >
              <LogOut size={20} />
              Sair
            </button>
          </div>
        </div>

        <div className="mb-8">
          <PomodoroTimer onActiveChange={setIsPomodoroActive} />
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
} 