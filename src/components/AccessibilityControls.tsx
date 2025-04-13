import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const AccessibilityControls = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full transition-all duration-300 hover:bg-primary/10 dark:hover:bg-white/10"
      title={isDarkMode ? 'Desativar modo escuro' : 'Ativar modo escuro'}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-primary" />
      )}
    </button>
  );
}; 