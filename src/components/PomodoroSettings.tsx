import { useState } from 'react';
import { Settings } from 'lucide-react';

interface PomodoroSettingsProps {
  onTimeChange: (studyTime: number, breakTime: number) => void;
}

export const PomodoroSettings = ({ onTimeChange }: PomodoroSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);

  const handleSave = () => {
    onTimeChange(studyTime, breakTime);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary dark:text-white transition-all duration-300"
      >
        <Settings size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-4 text-primary dark:text-white">Configurações do Pomodoro</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tempo de Estudo (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={studyTime}
                onChange={(e) => setStudyTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tempo de Pausa (minutos)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={breakTime}
                onChange={(e) => setBreakTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleSave}
              className="w-full px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 