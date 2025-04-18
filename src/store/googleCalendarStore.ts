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

      connect: async () => {
        try {
          console.log('Iniciando processo de conexão com Google Calendar...');
          
          // Limpa qualquer estado anterior
          set({ isConnected: false, tokens: null });
          localStorage.removeItem('google-calendar-store');
          
          const url = await getAuthUrl();
          console.log('URL de autenticação obtida, redirecionando...');
          
          // Salva o estado atual antes de redirecionar
          const currentState = get();
          localStorage.setItem('google-calendar-pre-auth', JSON.stringify(currentState));
          
          // Redireciona para a página de autenticação do Google
          window.location.href = url;
        } catch (error) {
          console.error('Erro ao obter URL de autenticação:', error);
          set({ isConnected: false, tokens: null });
          throw error;
        }
      },

      disconnect: () => {
        console.log('Desconectando do Google Calendar...');
        set({ isConnected: false, tokens: null });
        localStorage.removeItem('google-calendar-store');
      },

      handleCallback: async (code: string) => {
        try {
          console.log('Processando callback com código:', code);
          
          // Recupera o estado anterior
          const preAuthState = localStorage.getItem('google-calendar-pre-auth');
          if (preAuthState) {
            const state = JSON.parse(preAuthState);
            console.log('Estado pré-autenticação recuperado:', state);
          }
          
          const tokens = await getTokens(code);
          console.log('Tokens obtidos com sucesso');
          
          set({ 
            isConnected: true, 
            tokens: {
              ...tokens,
              created_at: Date.now()
            }
          });
          
          // Remove o estado pré-autenticação
          localStorage.removeItem('google-calendar-pre-auth');
          
          // Redireciona para a página do calendário
          window.location.href = '/dashboard/calendar';
        } catch (error) {
          console.error('Erro ao obter tokens:', error);
          set({ isConnected: false, tokens: null });
          throw error;
        }
      },

      checkTokenValidity: () => {
        const { tokens } = get();
        if (!tokens) {
          console.log('Nenhum token encontrado');
          return false;
        }
        
        const now = Date.now();
        const tokenAge = now - tokens.created_at;
        const tokenExpired = tokenAge >= (tokens.expires_in - 300) * 1000;
        
        console.log('Verificação de token:', {
          tokenAge: Math.floor(tokenAge / 1000) + 's',
          expiresIn: tokens.expires_in + 's',
          tokenExpired,
          remainingTime: Math.floor((tokens.expires_in * 1000 - tokenAge) / 1000) + 's'
        });
        
        return !tokenExpired;
      },

      refreshToken: async () => {
        const { tokens } = get();
        if (!tokens?.refresh_token) {
          console.error('Refresh token não disponível');
          throw new Error('Refresh token não disponível');
        }

        try {
          console.log('Tentando renovar token...');
          const response = await fetch(`${API_URL}/auth/google/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh_token: tokens.refresh_token }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro ao renovar token:', errorData);
            throw new Error('Falha ao renovar token');
          }

          const newTokens = await response.json();
          console.log('Token renovado com sucesso');
          
          set({
            tokens: {
              ...newTokens,
              created_at: Date.now(),
              refresh_token: tokens.refresh_token
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
          console.error('Token de acesso não disponível');
          throw new Error('Não autenticado');
        }

        try {
          if (!checkTokenValidity()) {
            console.log('Token expirado, tentando renovar...');
            await refreshToken();
          }

          console.log('Buscando eventos...');
          const events = await listCalendarEvents(timeMin, timeMax, tokens.access_token);
          console.log('Eventos obtidos com sucesso:', events.length);
          
          return events;
        } catch (error) {
          console.error('Erro ao buscar eventos:', error);
          if (error instanceof Error && error.message.includes('Token de acesso inválido')) {
            set({ isConnected: false, tokens: null });
          }
          throw error;
        }
      },

      syncEvent: async (event: any) => {
        const { tokens, checkTokenValidity, refreshToken } = get();
        
        if (!tokens?.access_token) {
          throw new Error('Não autenticado');
        }

        try {
          if (!checkTokenValidity()) {
            await refreshToken();
          }

          return await createCalendarEvent(event, tokens.access_token);
        } catch (error) {
          console.error('Erro ao sincronizar evento:', error);
          if (error instanceof Error && error.message.includes('Token de acesso inválido')) {
            set({ isConnected: false, tokens: null });
          }
          throw error;
        }
      },

      deleteEvent: async (eventId: string) => {
        const { tokens, checkTokenValidity, refreshToken } = get();
        
        if (!tokens?.access_token) {
          throw new Error('Não autenticado');
        }

        try {
          if (!checkTokenValidity()) {
            await refreshToken();
          }

          return await deleteCalendarEvent(eventId, tokens.access_token);
        } catch (error) {
          console.error('Erro ao deletar evento:', error);
          if (error instanceof Error && error.message.includes('Token de acesso inválido')) {
            set({ isConnected: false, tokens: null });
          }
          throw error;
        }
      },
    }),
    {
      name: 'google-calendar-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          try {
            return JSON.parse(str);
          } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
          }
        },
      },
    }
  )
); 