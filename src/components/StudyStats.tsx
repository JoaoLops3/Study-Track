import { useEffect } from 'react';
import { Clock, Target, Calendar, CalendarDays } from 'lucide-react';
import { useStudyStore } from '../store/studyStore';

interface StudyStatsProps {
  isPomodoroActive: boolean;
}

export const StudyStats = ({ isPomodoroActive }: StudyStatsProps) => {
  const {
    studyTime,
    dailyGoal,
    monthlyGoal,
    yearlyGoal,
    dailyProgress,
    monthlyProgress,
    yearlyProgress,
    incrementStudyTime
  } = useStudyStore();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPomodoroActive) {
        incrementStudyTime(1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPomodoroActive, incrementStudyTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  return (
    <div className="bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-primary dark:text-white">Estatísticas de Estudo</h2>
      
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white dark:bg-gray-800">
            <Clock className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo de estudo hoje</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary dark:text-white">
                  {formatTime(studyTime)}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({dailyProgress.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-white transition-all duration-300"
                style={{ width: `${Math.min(dailyProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white dark:bg-gray-800">
            <Target className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta diária restante</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary dark:text-white">
                  {formatTime(dailyGoal)}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({dailyProgress.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-white transition-all duration-300"
                style={{ width: `${Math.min(dailyProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white dark:bg-gray-800">
            <Calendar className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta mensal restante</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary dark:text-white">
                  {formatTime(monthlyGoal)}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({monthlyProgress.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-white transition-all duration-300"
                style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-white dark:bg-gray-800">
            <CalendarDays className="w-6 h-6 text-primary dark:text-white" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Meta anual restante</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary dark:text-white">
                  {formatTime(yearlyGoal)}
                </span>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  ({yearlyProgress.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary dark:bg-white transition-all duration-300"
                style={{ width: `${Math.min(yearlyProgress, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 