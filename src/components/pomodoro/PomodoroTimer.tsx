import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PomodoroTimerProps {
  onActiveChange: (isActive: boolean) => void;
}

export const PomodoroTimer = ({ onActiveChange }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Tocar som de notificação
      new Audio('/notification.mp3').play();
      setIsActive(false);
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? 25 * 60 : 5 * 60); // Alterna entre 25 minutos e 5 minutos de pausa
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak]);

  useEffect(() => {
    onActiveChange(isActive);
  }, [isActive, onActiveChange]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? 5 * 60 : 25 * 60);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex flex-col items-center gap-4 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {isBreak ? 'Pausa' : 'Pomodoro'}
      </h2>
      <div className={`text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-4">
        <button
          onClick={toggleTimer}
          className={`p-3 rounded-full ${
            isActive 
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          } transition-colors`}
        >
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={resetTimer}
          className={`p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors`}
        >
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
}; 