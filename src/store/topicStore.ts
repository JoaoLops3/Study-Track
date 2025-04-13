import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Topic, Review } from '../types/Topic';

interface TopicStore {
  topics: Topic[];
  addTopic: (topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTopicTime: (topicId: string, timeSpent: number) => void;
  updateTopicConfidence: (topicId: string, confidence: number) => void;
  getTopicsToReview: () => Topic[];
}

export const useTopicStore = create<TopicStore>()(
  persist(
    (set, get) => ({
      topics: [],
      
      addTopic: (topic) => {
        const newTopic: Topic = {
          ...topic,
          id: crypto.randomUUID(),
          timeSpent: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          reviewHistory: [],
          nextReviewDate: new Date().toISOString()
        };
        
        set((state) => ({
          topics: [...state.topics, newTopic]
        }));
      },

      updateTopicTime: (topicId, timeSpent) => {
        set((state) => ({
          topics: state.topics.map((topic) =>
            topic.id === topicId
              ? {
                  ...topic,
                  timeSpent: topic.timeSpent + timeSpent,
                  lastStudySession: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              : topic
          )
        }));
      },

      updateTopicConfidence: (topicId, confidence) => {
        set((state) => ({
          topics: state.topics.map((topic) => {
            if (topic.id === topicId) {
              const review: Review = {
                date: new Date().toISOString(),
                confidence
              };

              // Calcular próxima data de revisão baseado na confiança
              const daysUntilNextReview = Math.pow(2, confidence);
              const nextReviewDate = new Date();
              nextReviewDate.setDate(nextReviewDate.getDate() + daysUntilNextReview);

              return {
                ...topic,
                reviewHistory: [...(topic.reviewHistory || []), review],
                nextReviewDate: nextReviewDate.toISOString(),
                updatedAt: new Date().toISOString()
              };
            }
            return topic;
          })
        }));
      },

      getTopicsToReview: () => {
        const { topics } = get();
        const now = new Date();
        
        return topics.filter((topic) => {
          if (!topic.nextReviewDate) return false;
          const reviewDate = new Date(topic.nextReviewDate);
          return reviewDate <= now;
        });
      }
    }),
    {
      name: 'topic-store'
    }
  )
); 