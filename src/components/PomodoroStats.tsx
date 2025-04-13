import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { Clock, Calendar, Target, Zap } from 'lucide-react';
import { useStudyStore } from '../store/studyStore';

interface Session {
  date: string;
  studyTime: number;
  breakTime: number;
  completedPomodoros: number;
}

export const PomodoroStats = () => {
  const { getSessions } = useStudyStore();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [totalBreakTime, setTotalBreakTime] = useState(0);
  const [averageSessionTime, setAverageSessionTime] = useState(0);
  const [totalPomodoros, setTotalPomodoros] = useState(0);
  const [dailyAverage, setDailyAverage] = useState(0);

  useEffect(() => {
    const savedSessions = getSessions();
    setSessions(savedSessions);

    // Calcular estatísticas
    const totalStudy = savedSessions.reduce((acc, session) => acc + session.studyTime, 0);
    const totalBreak = savedSessions.reduce((acc, session) => acc + session.breakTime, 0);
    const totalPoms = savedSessions.reduce((acc, session) => acc + session.completedPomodoros, 0);
    const average = savedSessions.length > 0 ? totalStudy / savedSessions.length : 0;

    // Calcular média diária
    const sessionsByDay = savedSessions.reduce((acc: { [key: string]: number }, session) => {
      const date = new Date(session.date).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + session.completedPomodoros;
      return acc;
    }, {});

    const dailyAvg = Object.values(sessionsByDay).reduce((acc, val) => acc + val, 0) / Object.keys(sessionsByDay).length || 0;

    setTotalStudyTime(totalStudy);
    setTotalBreakTime(totalBreak);
    setAverageSessionTime(average);
    setTotalPomodoros(totalPoms);
    setDailyAverage(dailyAvg);
  }, [getSessions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Garantir que sempre tenhamos dados para o gráfico
  const chartData = sessions.length > 0 
    ? sessions.slice(-7).map(session => ({
        date: new Date(session.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        studyTime: session.studyTime / 60, // Converter para minutos
        breakTime: session.breakTime / 60,
        pomodoros: session.completedPomodoros
      }))
    : Array(7).fill(0).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return {
          date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          studyTime: 0,
          breakTime: 0,
          pomodoros: 0
        };
      });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)} {entry.name.includes('Tempo') ? 'min' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card dark:bg-card-dark p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-primary dark:text-white">Estatísticas Detalhadas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary dark:text-white" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Total de Estudo</span>
          </div>
          <span className="text-2xl font-bold text-primary dark:text-white">{formatTime(totalStudyTime)}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-primary dark:text-white" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Total de Pausa</span>
          </div>
          <span className="text-2xl font-bold text-primary dark:text-white">{formatTime(totalBreakTime)}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-primary dark:text-white" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pomodoros Completados</span>
          </div>
          <span className="text-2xl font-bold text-primary dark:text-white">{totalPomodoros}</span>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-primary dark:text-white" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Média Diária</span>
          </div>
          <span className="text-2xl font-bold text-primary dark:text-white">{dailyAverage.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-primary dark:text-white">Tempo de Estudo e Pausa</h3>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="studyTime" name="Tempo de Estudo (min)" fill="#4F46E5" />
              <Bar dataKey="breakTime" name="Tempo de Pausa (min)" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 bg-white dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-primary dark:text-white">Pomodoros por Dia</h3>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="pomodoros" 
                name="Pomodoros" 
                stroke="#4F46E5" 
                strokeWidth={2}
                dot={{ fill: '#4F46E5', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}; 