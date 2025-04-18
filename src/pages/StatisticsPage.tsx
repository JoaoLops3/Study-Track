import { useNavigate } from 'react-router-dom';
import { StudyStats } from '@/components/statistics/StudyStats';
import { PomodoroStats } from '@/components/statistics/PomodoroStats';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function StatisticsPage() {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen p-8 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Estatísticas
          </h1>
        </div>

        <div className="grid gap-8">
          <StudyStats />
          <PomodoroStats />
        </div>
      </div>
    </div>
  );
} 