import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Topic } from '../types/Topic';

interface LearningMetricsProps {
  topics: Topic[];
}

export const LearningMetrics: React.FC<LearningMetricsProps> = ({ topics }) => {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const topicsStudied = topics.filter(topic => {
        const lastStudy = topic.lastStudySession ? new Date(topic.lastStudySession).toISOString().split('T')[0] : null;
        return lastStudy === date;
      }).length;

      const avgConfidence = topics
        .filter(topic => {
          const reviewsOnDate = topic.reviewHistory?.filter(review => 
            new Date(review.date).toISOString().split('T')[0] === date
          );
          return reviewsOnDate && reviewsOnDate.length > 0;
        })
        .reduce((acc, topic) => {
          const reviewsOnDate = topic.reviewHistory?.filter(review =>
            new Date(review.date).toISOString().split('T')[0] === date
          );
          const lastReview = reviewsOnDate?.[reviewsOnDate.length - 1];
          return acc + (lastReview?.confidence || 0);
        }, 0) / topics.length || 0;

      return {
        date: date.split('-').slice(1).join('/'),
        topicsStudied,
        avgConfidence: Math.round(avgConfidence * 100) / 100
      };
    });
  }, [topics]);

  const totalTopics = topics.length;
  const topicsWithReviews = topics.filter(t => t.reviewHistory && t.reviewHistory.length > 0).length;
  const avgConfidence = topics.reduce((acc, topic) => {
    const lastReview = topic.reviewHistory?.[topic.reviewHistory.length - 1];
    return acc + (lastReview?.confidence || 0);
  }, 0) / totalTopics;

  return (
    <div className="card p-6">
      <h2 className="text-2xl font-bold mb-6">Métricas de Aprendizado</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="text-center">
          <p className="text-lg font-semibold">{totalTopics}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total de Tópicos</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{topicsWithReviews}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tópicos Revisados</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold">{Math.round(avgConfidence * 100) / 100}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Confiança Média</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="topicsStudied"
              stroke="#8884d8"
              name="Tópicos Estudados"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avgConfidence"
              stroke="#82ca9d"
              name="Confiança Média"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 