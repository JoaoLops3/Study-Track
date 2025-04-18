import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Play, Pause, RotateCcw, Settings, ArrowLeft, Bell, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/study-track-logo.png';

export const Pomodoro = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [timeLeft, setTimeLeft] = useState(10); // 10 segundos
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [workTime, setWorkTime] = useState(10); // 10 segundos
  const [breakTime, setBreakTime] = useState(5); // 5 segundos
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Tocar som de notificação
      new Audio('/notification.mp3').play();
      setShowNotification(true);
      setIsRunning(false);
      
      // Aguardar 3 segundos antes de mudar para o próximo estado
      setTimeout(() => {
        setShowNotification(false);
        setIsBreak(!isBreak);
        setTimeLeft((isBreak ? workTime : breakTime));
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, workTime, breakTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setShowNotification(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setShowNotification(false);
    setTimeLeft((isBreak ? breakTime : workTime));
  };

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSaveSettings = () => {
    setTimeLeft((isBreak ? breakTime : workTime));
    setShowSettings(false);
  };

  const adjustTime = (amount: number) => {
    if (!isRunning && !showNotification) {
      const newTime = Math.max(1, Math.min(60, (isBreak ? breakTime : workTime) + amount));
      if (isBreak) {
        setBreakTime(newTime);
        setTimeLeft(newTime);
      } else {
        setWorkTime(newTime);
        setTimeLeft(newTime);
      }
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Study Track Logo"
                className="h-10 w-10"
              />
              <h1 className="text-3xl font-bold text-primary dark:text-white">Pomodoro</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>

          <div className={`p-8 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className={`w-64 h-64 rounded-full border-8 ${
                  isBreak 
                    ? 'border-green-200 dark:border-green-700'
                    : 'border-blue-200 dark:border-blue-700'
                } flex items-center justify-center mb-8 transition-colors`}>
                  <span className={`text-6xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isBreak 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400'
                }`}>
                  {isBreak ? 'Descanso' : 'Foco'}
                </div>
              </div>

              {showNotification && (
                <div className="mb-8 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-400 flex items-center gap-2">
                  <Bell size={20} />
                  <span className="font-medium">
                    {isBreak ? 'Hora de voltar ao foco!' : 'Hora de descansar!'}
                  </span>
                </div>
              )}

              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleStart}
                  disabled={isRunning || showNotification}
                  className={`p-4 rounded-full ${
                    isRunning || showNotification
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  } transition-colors`}
                >
                  <Play size={24} />
                </button>
                <button
                  onClick={handlePause}
                  disabled={!isRunning || showNotification}
                  className={`p-4 rounded-full ${
                    !isRunning || showNotification
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                  } transition-colors`}
                >
                  <Pause size={24} />
                </button>
                <button
                  onClick={handleReset}
                  disabled={showNotification}
                  className={`p-4 rounded-full ${
                    showNotification
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  } transition-colors`}
                >
                  <RotateCcw size={24} />
                </button>
                <button
                  onClick={handleSettings}
                  disabled={showNotification}
                  className={`p-4 rounded-full ${
                    showSettings
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } text-white transition-colors`}
                >
                  <Settings size={24} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => adjustTime(-1)}
                  disabled={isRunning || showNotification || (isBreak ? breakTime <= 1 : workTime <= 1)}
                  className={`p-2 rounded-full ${
                    isRunning || showNotification || (isBreak ? breakTime <= 1 : workTime <= 1)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  } transition-colors`}
                >
                  <Minus size={20} />
                </button>
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {isBreak ? breakTime : workTime} segundos
                </span>
                <button
                  onClick={() => adjustTime(1)}
                  disabled={isRunning || showNotification || (isBreak ? breakTime >= 60 : workTime >= 60)}
                  className={`p-2 rounded-full ${
                    isRunning || showNotification || (isBreak ? breakTime >= 60 : workTime >= 60)
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                  } transition-colors`}
                >
                  <Plus size={20} />
                </button>
              </div>

              {showSettings && (
                <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} w-full max-w-md`}>
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Configurações</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tempo de Foco (segundos)
                      </label>
                      <input
                        type="number"
                        value={workTime}
                        onChange={(e) => setWorkTime(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        min="1"
                        max="60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tempo de Descanso (segundos)
                      </label>
                      <input
                        type="number"
                        value={breakTime}
                        onChange={(e) => setBreakTime(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        min="1"
                        max="30"
                      />
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 