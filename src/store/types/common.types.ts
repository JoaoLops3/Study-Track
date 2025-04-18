export interface Review {
  date: Date;
  confidence: number;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  timeSpent: number;
  createdAt: Date;
  lastStudySession?: Date;
  nextReviewDate?: Date;
  reviewHistory?: Review[];
  status: 'toStudy' | 'studying' | 'studied';
  updatedAt: Date;
}

export interface Session {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: 'study' | 'break';
  completedPomodoros: number;
}

export type Column = {
  id: string;
  title: string;
  topics: Topic[];
};