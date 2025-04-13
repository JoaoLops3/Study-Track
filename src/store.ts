import { create } from 'zustand';
import { Topic } from './types';
import { dbFunctions } from './database/db';

interface StudyStore {
  topics: Topic[];
  addTopic: (topic: Omit<Topic, 'id'>) => Promise<void>;
  updateTopicStatus: (id: string, status: Topic['status']) => Promise<void>;
  deleteTopic: (id: string) => Promise<void>;
  fetchTopics: () => Promise<void>;
  updateTopicSummary: (id: string, summary: string) => Promise<void>;
}

export const useStudyStore = create<StudyStore>((set) => ({
  topics: [],

  fetchTopics: async () => {
    try {
      const topics = await dbFunctions.getAllTopics();
      set({ topics });
    } catch (error) {
      console.error('Erro ao buscar tópicos:', error);
    }
  },

  addTopic: async (topic) => {
    try {
      const newTopic = {
        ...topic,
        id: crypto.randomUUID(),
      };
      await dbFunctions.addTopic(newTopic);
      set((state) => ({
        topics: [newTopic, ...state.topics],
      }));
    } catch (error) {
      console.error('Erro ao adicionar tópico:', error);
    }
  },

  updateTopicStatus: async (id, status) => {
    try {
      await dbFunctions.updateTopicStatus(id, status);
      set((state) => ({
        topics: state.topics.map((topic) =>
          topic.id === id ? { ...topic, status } : topic
        ),
      }));
    } catch (error) {
      console.error('Erro ao atualizar status do tópico:', error);
    }
  },

  deleteTopic: async (id) => {
    try {
      await dbFunctions.deleteTopic(id);
      set((state) => ({
        topics: state.topics.filter((topic) => topic.id !== id),
      }));
    } catch (error) {
      console.error('Erro ao deletar tópico:', error);
    }
  },

  updateTopicSummary: async (id, summary) => {
    try {
      await dbFunctions.updateTopicSummary(id, summary);
      set((state) => ({
        topics: state.topics.map((topic) =>
          topic.id === id ? { ...topic, summary } : topic
        ),
      }));
    } catch (error) {
      console.error('Erro ao atualizar resumo do tópico:', error);
    }
  },
}));