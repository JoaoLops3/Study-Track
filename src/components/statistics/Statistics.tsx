import { useTopicStore } from '@/store/topicStore';
import { useTheme } from '@/contexts/ThemeContext';
import { BarChart2, Clock, BookOpen, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/study-track-logo.png';
import { ThemeToggle } from '../ThemeToggle';

export const Statistics = () => {
  const navigate = useNavigate();
  const topics = useTopicStore((state) => state.topics);
  const { isDarkMode } = useTheme();

  const totalTopics = topics.length;
  const studiedTopics = topics.filter(topic => topic.status === 'studied').length;
  const totalTimeSpent = topics.reduce((acc, topic) => acc + (topic.timeSpent || 0), 0);
  const averageTimePerTopic = totalTopics > 0 ? totalTimeSpent / totalTopics : 0;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Study Track Logo"
                className="h-10 w-10"
              />
              <h1 className="text-3xl font-bold text-primary dark:text-white">Estatísticas</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowLeft size={20} />
                Voltar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                  <BookOpen className={`${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tópicos</h2>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">Total: {totalTopics}</p>
                <p className="text-gray-600 dark:text-gray-300">Estudados: {studiedTopics}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${totalTopics > 0 ? (studiedTopics / totalTopics) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Progresso: {totalTopics > 0 ? Math.round((studiedTopics / totalTopics) * 100) : 0}%
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                  <Clock className={`${isDarkMode ? 'text-green-400' : 'text-green-600'}`} size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tempo</h2>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Total: {Math.round(totalTimeSpent / 60)} minutos
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Média: {Math.round(averageTimePerTopic / 60)} min/tópico
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min((totalTimeSpent / (totalTopics * 60)) * 10, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(totalTimeSpent / 3600)} horas de estudo
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                  <CheckCircle className={`${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Revisões</h2>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Total: {topics.reduce((acc, topic) => acc + (topic.reviewHistory?.length || 0), 0)}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Próximas: {topics.filter(topic => topic.nextReviewDate && new Date(topic.nextReviewDate) > new Date()).length}
                </p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                  <div 
                    className="bg-purple-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min((topics.reduce((acc, topic) => acc + (topic.reviewHistory?.length || 0), 0) / totalTopics) * 20, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Média de revisões por tópico
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-full ${isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'}`}>
                  <BarChart2 className={`${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} size={24} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Distribuição</h2>
              </div>
              <div className="space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Para estudar: {topics.filter(topic => topic.status === 'toStudy').length}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Em estudo: {topics.filter(topic => topic.status === 'studying').length}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Estudados: {studiedTopics}
                </p>
                <div className="flex gap-1 h-2.5 mt-2">
                  <div 
                    className="bg-orange-600 rounded-l-full" 
                    style={{ width: `${(topics.filter(t => t.status === 'toStudy').length / totalTopics) * 100}%` }}
                  />
                  <div 
                    className="bg-yellow-600" 
                    style={{ width: `${(topics.filter(t => t.status === 'studying').length / totalTopics) * 100}%` }}
                  />
                  <div 
                    className="bg-green-600 rounded-r-full" 
                    style={{ width: `${(studiedTopics / totalTopics) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 