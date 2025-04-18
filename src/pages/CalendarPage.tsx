import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useGoogleCalendarStore } from '@/store/googleCalendarStore';
import { Calendar } from '@/components/calendar/Calendar';
import { Button } from '@/components/shared/Button';
import { LogOut, Calendar as CalendarIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function CalendarPage() {
  const navigate = useNavigate();
  const { user, logout, checkAuth } = useAuthStore();
  const { isDarkMode } = useTheme();
  const { 
    isConnected, 
    connect, 
    disconnect, 
    handleCallback,
    syncEvent,
    getEvents
  } = useGoogleCalendarStore();

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

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      handleCallback(code).then(() => {
        window.history.replaceState({}, document.title, '/dashboard/calendar');
      });
    }
  }, [handleCallback]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleGoogleCalendarConnect = async () => {
    try {
      if (isConnected) {
        disconnect();
      } else {
        await connect();
      }
    } catch (error) {
      console.error('Erro ao conectar com Google Calendar:', error);
      // Aqui você pode adicionar uma notificação de erro para o usuário
    }
  };

  return (
    <div className={`container mx-auto px-4 py-8 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-primary dark:text-white">Calendário</h1>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              onClick={handleGoogleCalendarConnect}
              variant="outline"
              className="flex items-center gap-2"
            >
              <CalendarIcon size={20} />
              {isConnected ? 'Desconectar Google Calendar' : 'Conectar Google Calendar'}
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={20} />
              Sair
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <Calendar 
            onEventCreate={syncEvent}
            onEventUpdate={syncEvent}
            onEventDelete={getEvents}
            googleCalendarEvents={isConnected ? getEvents : undefined}
          />
        </div>
      </div>
    </div>
  );
} 