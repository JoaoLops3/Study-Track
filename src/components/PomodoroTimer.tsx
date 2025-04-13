import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useStudyStore } from '../store/studyStore';
import { PomodoroSettings } from './PomodoroSettings';

interface PomodoroTimerProps {
  onActiveChange: (isActive: boolean) => void;
}

export const PomodoroTimer = ({ onActiveChange }: PomodoroTimerProps) => {
  const [studyTime, setStudyTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [time, setTime] = useState(studyTime * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentSessionStudyTime, setCurrentSessionStudyTime] = useState(0);
  const [currentSessionBreakTime, setCurrentSessionBreakTime] = useState(0);
  const { incrementStudyTime, addSession } = useStudyStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/notification.mp3');
  }, []);

  useEffect(() => {
    onActiveChange(isActive && !isBreak);
  }, [isActive, isBreak, onActiveChange]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime - 1;
          if (!isBreak) {
            incrementStudyTime(1);
            setCurrentSessionStudyTime(prev => prev + 1);
          } else {
            setCurrentSessionBreakTime(prev => prev + 1);
          }
          return newTime;
        });
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      
      // Salvar a sessão quando um pomodoro é completado
      if (!isBreak) {
        setCompletedPomodoros(prev => prev + 1);
        addSession({
          studyTime: currentSessionStudyTime,
          breakTime: currentSessionBreakTime,
          completedPomodoros: 1
        });
      }
      
      // Resetar os contadores de tempo da sessão atual
      if (isBreak) {
        setCurrentSessionStudyTime(0);
        setCurrentSessionBreakTime(0);
      }
      
      setIsBreak(!isBreak);
      setTime(isBreak ? studyTime * 60 : breakTime * 60);

      if (audioRef.current) {
        audioRef.current.play();
      }
    }

    return () => clearInterval(interval);
  }, [isActive, time, isBreak, incrementStudyTime, studyTime, breakTime, addSession, currentSessionStudyTime, currentSessionBreakTime]);

  const handleTimeChange = (newStudyTime: number, newBreakTime: number) => {
    setStudyTime(newStudyTime);
    setBreakTime(newBreakTime);
    setTime(newStudyTime * 60);
    setIsActive(false);
    setIsBreak(false);
    setCurrentSessionStudyTime(0);
    setCurrentSessionBreakTime(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(studyTime * 60);
    setIsBreak(false);
    setCompletedPomodoros(0);
    setCurrentSessionStudyTime(0);
    setCurrentSessionBreakTime(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progress = ((isBreak ? breakTime * 60 : studyTime * 60) - time) / (isBreak ? breakTime * 60 : studyTime * 60) * 100;

  return (
    <div className="bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-primary dark:text-white">
          {isBreak ? 'Pausa' : 'Tempo de Estudo'}
        </h2>
        <div className="flex gap-2">
          <PomodoroSettings
            studyTime={studyTime}
            breakTime={breakTime}
            onTimeChange={handleTimeChange}
          />
          <button
            onClick={toggleTimer}
            className={`p-2 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-primary hover:bg-primary-dark text-white'
                : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary dark:text-white'
            }`}
          >
            {isActive ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-primary dark:text-white transition-all duration-300"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="w-full h-2 bg-white dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary dark:bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <span className="text-5xl font-bold text-primary dark:text-white">
          {formatTime(time)}
        </span>
      </div>

      <div className="mt-4 flex justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
        <span className={`${!isBreak ? 'text-primary dark:text-white font-medium' : ''}`}>
          Estudo: {studyTime}:00
        </span>
        <span className={`${isBreak ? 'text-primary dark:text-white font-medium' : ''}`}>
          Pausa: {breakTime}:00
        </span>
      </div>

      <div className="mt-4 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Pomodoros completados hoje: {completedPomodoros}
        </span>
      </div>
    </div>
  );
}; 