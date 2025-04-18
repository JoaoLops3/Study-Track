import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authDB } from '@/database/authDB';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const user = await authDB.getUserByEmail(email);
          if (user && user.password === password) {
            set({ user, isAuthenticated: true });
            localStorage.setItem('userId', user.id);
            return true;
          }
          return false;
        } catch (error) {
          console.error('Erro ao fazer login:', error);
          return false;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const emailExists = await authDB.checkEmailExists(email);
          if (emailExists) {
            return false;
          }

          const newUser = {
            name,
            email,
            password,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const user = await authDB.addUser(newUser);
          set({ user, isAuthenticated: true });
          localStorage.setItem('userId', user.id);
          return true;
        } catch (error) {
          console.error('Erro ao registrar:', error);
          return false;
        }
      },

      logout: async () => {
        try {
          set({ user: null, isAuthenticated: false });
          localStorage.removeItem('userId');
        } catch (error) {
          console.error('Erro ao fazer logout:', error);
        }
      },

      checkAuth: async () => {
        try {
          const userId = localStorage.getItem('userId');
          if (!userId) {
            set({ user: null, isAuthenticated: false });
            return false;
          }

          const user = await authDB.getUserById(userId);
          if (user) {
            set({ user, isAuthenticated: true });
            return true;
          }

          set({ user: null, isAuthenticated: false });
          return false;
        } catch (error) {
          console.error('Erro ao verificar autenticação:', error);
          set({ user: null, isAuthenticated: false });
          return false;
        }
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 