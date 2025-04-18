import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  getAuthUrl, 
  getTokens, 
  createCalendarEvent, 
  listCalendarEvents, 
  deleteCalendarEvent 
} from '@/lib/googleCalendar';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  created_at: number;
}

interface GoogleCalendarState {
  isConnected: boolean;
  tokens: TokenData | null;
  connect: () => void;
  disconnect: () => void;
  handleCallback: (code: string) => Promise<void>;
  syncEvent: (event: any) => Promise<void>;
  getEvents: (timeMin: string, timeMax: string) => Promise<any[]>;
  deleteEvent: (eventId: string) => Promise<void>;
  checkTokenValidity: () => boolean;
  refreshToken: () => Promise<void>;
}

export const useGoogleCalendarStore = create<GoogleCalendarState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      tokens: null,

      connect: () => {
        const authUrl = getAuthUrl();
        if (typeof authUrl === 'string') {
          window.location.href = authUrl;
        } else {
          authUrl.then(url => {
            window.location.href = url;
          });
        }
      },

      disconnect: () => {
        set({ isConnected: false, tokens: null });
        localStorage.removeItem('google-calendar-store');
      },

      handleCallback: async (code: string) => {
        try {
          const tokens = await getTokens(code);
          set({ 
            isConnected: true, 
            tokens: {
              ...tokens,
              created_at: Date.now()
            }
          });
        } catch (error) {
          console.error('Erro ao obter tokens:', error);
          set({ isConnected: false, tokens: null });
          throw error;
        }
      },

      checkTokenValidity: () => {
        const { tokens } = get();
        if (!tokens) return false;
        
        const now = Date.now();
        const tokenAge = now - tokens.created_at;
        const tokenExpired = tokenAge >= tokens.expires_in * 1000;
        
        return !tokenExpired;
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refresh_token) {
          throw new Error('Refresh token não disponível');
        }

        try {
          const response = await fetch(`${API_URL}/auth/google/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: tokens.refresh_token }),
          });

          if (!response.ok) {
            throw new Error('Falha ao renovar token');
          }

          const newTokens = await response.json();
          set({
            tokens: {
              ...newTokens,
              created_at: Date.now(),
              refresh_token: tokens.refresh_token // Mantém o refresh token original
            }
          });
        } catch (error) {
          console.error('Erro ao renovar token:', error);
          set({ isConnected: false, tokens: null });
          throw error;
        }
      },

      getEvents: async (timeMin: string, timeMax: string) => {
        const { tokens, checkTokenValidity, refreshToken } = get();
        
        if (!tokens?.access_token) {
          throw new Error('Não autenticado');
        }

        if (!checkTokenValidity()) {
          await refreshToken();
        }

        return listCalendarEvents(timeMin, timeMax, tokens.access_token);
      },

      syncEvent: async (event: any) => {
        const { tokens, checkTokenValidity, refreshToken } = get();
        
        if (!tokens?.access_token) {
          throw new Error('Não autenticado');
        }

        if (!checkTokenValidity()) {
          await refreshToken();
        }

        return createCalendarEvent(event, tokens.access_token);
      },

      deleteEvent: async (eventId: string) => {
        const { tokens, checkTokenValidity, refreshToken } = get();
        
        if (!tokens?.access_token) {
          throw new Error('Não autenticado');
        }

        if (!checkTokenValidity()) {
          await refreshToken();
        }

        return deleteCalendarEvent(eventId, tokens.access_token);
      },
    }),
    {
      name: 'google-calendar-store',
    }
  )
); 