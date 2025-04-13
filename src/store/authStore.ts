import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  users: User[];
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface StoredUser extends User {
  password: string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: [],
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const state = get();
        const users = state.users as StoredUser[];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
          throw new Error('Email ou senha incorretos');
        }

        const { password: _, ...userWithoutPassword } = user;
        set({
          user: userWithoutPassword,
          isAuthenticated: true
        });
      },

      register: async (name: string, email: string, password: string) => {
        const state = get();
        const users = state.users as StoredUser[];

        if (users.some(u => u.email === email)) {
          throw new Error('Este email já está cadastrado');
        }

        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password
        };

        const { password: _, ...userWithoutPassword } = newUser;

        set(state => ({
          users: [...state.users, newUser],
          user: userWithoutPassword,
          isAuthenticated: true
        }));
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'auth-storage',
      version: 1
    }
  )
); 