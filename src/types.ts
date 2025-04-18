export interface Review {
  date: string;
  confidence: number;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  status: 'new' | 'toStudy' | 'studying' | 'studied';
  createdAt: string;
  updatedAt: string;
  timeSpent?: number;
  reviewHistory?: Review[];
  nextReviewDate?: string;
  lastStudySession?: string;
} 