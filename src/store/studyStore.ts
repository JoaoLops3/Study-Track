import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Session {
  date: string;
  studyTime: number;
  breakTime: number;
  completedPomodoros: number;
}

interface StudyState {
  studyTime: number;
  dailyGoal: number;
  monthlyGoal: number;
  yearlyGoal: number;
  dailyProgress: number;
  monthlyProgress: number;
  yearlyProgress: number;
  lastUpdate: string;
  sessions: Session[];
  incrementStudyTime: (seconds: number) => void;
  setDailyGoal: (minutes: number) => void;
  resetDailyProgress: () => void;
  addSession: (session: Omit<Session, 'date'>) => void;
  getSessions: () => Session[];
}

export const useStudyStore = create<StudyState>()(
  persist(
    (set, get) => ({
      studyTime: 0,
      dailyGoal: 120 * 60, // 120 minutos em segundos
      monthlyGoal: 120 * 60 * 30, // 120 minutos * 30 dias
      yearlyGoal: 120 * 60 * 365, // 120 minutos * 365 dias
      dailyProgress: 0,
      monthlyProgress: 0,
      yearlyProgress: 0,
      lastUpdate: new Date().toISOString().split('T')[0],
      sessions: [],

      incrementStudyTime: (seconds) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        const newStudyTime = state.studyTime + seconds;
        
        // Reset progress if it's a new day
        if (today !== state.lastUpdate) {
          return {
            studyTime: seconds,
            dailyGoal: 120 * 60, // Reset para 120 minutos
            monthlyGoal: 120 * 60 * 30,
            yearlyGoal: 120 * 60 * 365,
            dailyProgress: (seconds / (120 * 60)) * 100,
            monthlyProgress: (seconds / (120 * 60 * 30)) * 100,
            yearlyProgress: (seconds / (120 * 60 * 365)) * 100,
            lastUpdate: today
          };
        }

        // Decrementa as metas conforme o tempo de estudo aumenta
        const remainingDailyGoal = Math.max(0, state.dailyGoal - seconds);
        const remainingMonthlyGoal = Math.max(0, state.monthlyGoal - seconds);
        const remainingYearlyGoal = Math.max(0, state.yearlyGoal - seconds);

        return {
          studyTime: newStudyTime,
          dailyGoal: remainingDailyGoal,
          monthlyGoal: remainingMonthlyGoal,
          yearlyGoal: remainingYearlyGoal,
          dailyProgress: ((120 * 60 - remainingDailyGoal) / (120 * 60)) * 100,
          monthlyProgress: ((120 * 60 * 30 - remainingMonthlyGoal) / (120 * 60 * 30)) * 100,
          yearlyProgress: ((120 * 60 * 365 - remainingYearlyGoal) / (120 * 60 * 365)) * 100,
          lastUpdate: today
        };
      }),

      setDailyGoal: (minutes) => set((state) => ({
        dailyGoal: minutes * 60,
        monthlyGoal: minutes * 60 * 30,
        yearlyGoal: minutes * 60 * 365
      })),

      resetDailyProgress: () => set((state) => ({
        studyTime: 0,
        dailyGoal: 120 * 60,
        monthlyGoal: 120 * 60 * 30,
        yearlyGoal: 120 * 60 * 365,
        dailyProgress: 0,
        monthlyProgress: 0,
        yearlyProgress: 0,
        lastUpdate: new Date().toISOString().split('T')[0]
      })),

      addSession: (session) => set((state) => {
        const today = new Date().toISOString();
        const newSession = { ...session, date: today };
        
        // Filtrar sessões antigas (manter apenas últimos 30 dias)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const filteredSessions = state.sessions.filter(s => 
          new Date(s.date) > thirtyDaysAgo
        );

        return {
          sessions: [...filteredSessions, newSession]
        };
      }),

      getSessions: () => {
        const state = get();
        // Ordenar sessões por data, mais recentes primeiro
        return [...state.sessions].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
      }
    }),
    {
      name: 'study-storage',
      version: 1
    }
  )
); 