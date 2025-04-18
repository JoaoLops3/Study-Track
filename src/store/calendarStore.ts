import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description?: string;
  topicId?: string;
}

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, event: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsForDate: (date: Date) => CalendarEvent[];
  syncWithGoogleCalendar: () => Promise<void>;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now().toString(),
        };
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },
      getEventsForDate: (date) => {
        return get().events.filter((event) => {
          const eventDate = new Date(event.date);
          return eventDate.toDateString() === date.toDateString();
        });
      },
      syncWithGoogleCalendar: async () => {
        // Implementação da sincronização com o Google Calendar
        // Será implementada posteriormente
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
); 