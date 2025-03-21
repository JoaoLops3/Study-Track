import { create } from 'zustand';
import { Topic } from './types';

interface StudyStore {
  topics: Topic[];
  addTopic: (title: string) => void;
  updateTopicStatus: (topicId: string, status: Topic['status']) => void;
  updateTopicSummary: (topicId: string, summary: string) => void;
  deleteTopic: (topicId: string) => void;
}

export const useStudyStore = create<StudyStore>((set) => ({
  topics: [],
  addTopic: (title) =>
    set((state) => ({
      topics: [
        ...state.topics,
        {
          id: crypto.randomUUID(),
          title,
          summary: '',
          status: 'new',
        },
      ],
    })),
  updateTopicStatus: (topicId, status) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId ? { ...topic, status } : topic
      ),
    })),
  updateTopicSummary: (topicId, summary) =>
    set((state) => ({
      topics: state.topics.map((topic) =>
        topic.id === topicId ? { ...topic, summary } : topic
      ),
    })),
  deleteTopic: (topicId) =>
    set((state) => ({
      topics: state.topics.filter((topic) => topic.id !== topicId),
    })),
}));