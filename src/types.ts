export type Topic = {
  id: string;
  title: string;
  summary: string;
  status: 'new' | 'toStudy' | 'studying' | 'studied';
};

export type Column = {
  id: string;
  title: string;
  topics: Topic[];
};