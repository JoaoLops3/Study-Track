import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, ArrowLeft, Trash2, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCalendarStore, CalendarEvent } from '@/store/calendarStore';
import { useGoogleCalendarStore } from '@/store/googleCalendarStore';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'react-hot-toast';

export const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, getEvents, tokens, refreshToken, connect, disconnect } = useGoogleCalendarStore();
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({});
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const { events: localEvents, addEvent, getEventsForDate, deleteEvent } = useCalendarStore();

  // Verifica se o usuário está autenticado e redireciona se necessário
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);
  const days = useMemo(() => eachDayOfInterval({ start: monthStart, end: monthEnd }), [monthStart, monthEnd]);

  const fetchGoogleEvents = useCallback(async () => {
    if (!isConnected || !tokens?.access_token || !user) {
      setGoogleEvents([]);
      return;
    }

    setIsLoading(true);
    try {
      const timeMin = monthStart.toISOString();
      const timeMax = monthEnd.toISOString();
      
      // Verifica se o token está expirado
      if (tokens.expires_in && Date.now() - tokens.created_at >= (tokens.expires_in - 300) * 1000) {
        console.log('Token expirado, renovando...');
        await refreshToken();
      }

      const events = await getEvents(timeMin, timeMax);
      setGoogleEvents(events);
      setError(null);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
      if (error instanceof Error) {
        if (error.message.includes('Token de acesso inválido')) {
          setError('Sua sessão expirou. Por favor, reconecte-se ao Google Calendar.');
          disconnect(); // Desconecta automaticamente
          setGoogleEvents([]);
        } else {
          setError('Erro ao buscar eventos do Google Calendar. Por favor, tente novamente.');
          setGoogleEvents([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, tokens, monthStart, monthEnd, refreshToken, getEvents, user, disconnect]);

  useEffect(() => {
    fetchGoogleEvents();
  }, [fetchGoogleEvents, currentDate]);

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }, []);

  const handleDateClick = useCallback((date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  }, []);

  const handleAddEvent = useCallback(() => {
    if (selectedDate && newEvent.title) {
      addEvent({
        title: newEvent.title,
        date: selectedDate.toISOString(),
        description: newEvent.description,
        topicId: newEvent.topicId,
      });
      setIsModalOpen(false);
      setNewEvent({});
      toast.success('Evento adicionado com sucesso!');
    }
  }, [selectedDate, newEvent, addEvent]);

  const getEventsForDay = useCallback((day: Date) => {
    const localEventsForDay = getEventsForDate(day);
    const googleEventsForDay = googleEvents.filter(event => {
      const eventDate = parseISO(event.start.dateTime || event.start.date);
      return format(eventDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd');
    });

    return [
      ...localEventsForDay,
      ...googleEventsForDay.map(event => ({
        id: event.id,
        title: event.summary,
        date: event.start.dateTime || event.start.date,
        description: event.description,
        isGoogleEvent: true,
        color: event.colorId ? `#${event.colorId}` : '#34D399' // Cor padrão para eventos do Google
      }))
    ];
  }, [googleEvents, getEventsForDate]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    try {
      deleteEvent(eventId);
      toast.success('Evento excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      toast.error('Erro ao excluir evento. Por favor, tente novamente.');
    }
  }, [deleteEvent]);

  const handleBack = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleGoogleCalendarAction = useCallback(async () => {
    try {
      if (isConnected) {
        disconnect();
        toast.success('Desconectado do Google Calendar com sucesso!');
      } else {
        await connect();
      }
    } catch (error) {
      console.error('Erro ao conectar/desconectar:', error);
      toast.error('Erro ao conectar/desconectar do Google Calendar. Por favor, tente novamente.');
    }
  }, [isConnected, connect, disconnect]);

  return (
    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <ArrowLeft size={20} />
          Voltar ao Dashboard
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoogleCalendarAction}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isConnected ? (
              <>
                <LogOut size={20} />
                Desconectar Google Calendar
              </>
            ) : (
              <>
                <CalendarIcon size={20} />
                Conectar Google Calendar
              </>
            )}
          </button>
          <ThemeToggle />
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-medium">
              {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
          <div
            key={day}
            className="text-center font-medium py-2"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const dayEvents = getEventsForDay(day);
          return (
            <div
              key={day.toString()}
              onClick={() => handleDateClick(day)}
              className={`p-2 min-h-[100px] border rounded cursor-pointer ${
                isToday(day) ? 'border-blue-500' : 'border-gray-200 dark:border-gray-700'
              } ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}`}
            >
              <span className={`text-sm ${isToday(day) ? 'text-blue-500 font-bold' : ''}`}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate flex justify-between items-center ${
                      event.isGoogleEvent 
                        ? 'bg-green-100 dark:bg-green-900' 
                        : 'bg-blue-100 dark:bg-blue-900'
                    }`}
                    style={event.color ? { backgroundColor: event.color } : undefined}
                  >
                    <span className="truncate">{event.title}</span>
                    {!event.isGoogleEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEvent(event.id);
                        }}
                        className="p-1 hover:bg-opacity-50 rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className={`p-6 rounded-lg w-96 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Adicionar Evento para {selectedDate && format(selectedDate, 'dd/MM/yyyy')}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Título do evento"
                value={newEvent.title || ''}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <textarea
                placeholder="Descrição"
                value={newEvent.description || ''}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                className={`w-full p-2 border rounded ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 