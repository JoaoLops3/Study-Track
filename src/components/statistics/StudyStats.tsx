import { useTopicStore } from '@/store/topicStore';
import { useTheme } from '@/contexts/ThemeContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function StudyStats() {
  const { topics } = useTopicStore();
  const { isDarkMode } = useTheme();

  const statusCounts = {
    toStudy: topics.filter(topic => topic.status === 'toStudy').length,
    studying: topics.filter(topic => topic.status === 'studying').length,
    studied: topics.filter(topic => topic.status === 'studied').length,
  };

  const data = [
    { name: 'Para Estudar', value: statusCounts.toStudy },
    { name: 'Estudando', value: statusCounts.studying },
    { name: 'Estudado', value: statusCounts.studied },
  ];

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Progresso dos Estudos
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Para Estudar</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {statusCounts.toStudy}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Estudando</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {statusCounts.studying}
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Estudado</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {statusCounts.studied}
          </p>
        </div>
      </div>
    </div>
  );
} 