import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';

export function AccessibilityControls() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audioElements = document.querySelectorAll('audio, video');
    audioElements.forEach((element) => {
      (element as HTMLMediaElement).muted = isMuted;
    });
  }, [isMuted]);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={isDarkMode ? 'Alternar para modo claro' : 'Alternar para modo escuro'}
      >
        {isDarkMode ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700" />
        )}
      </button>

      <button
        onClick={() => setIsMuted(!isMuted)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
      >
        {isMuted ? (
          <VolumeX className="w-5 h-5 text-gray-500" />
        ) : (
          <Volume2 className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  );
} 