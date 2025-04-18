import { useTheme } from '@/contexts/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function PomodoroStats() {
  const { isDarkMode } = useTheme();

  // Dados de exemplo - Você pode substituir por dados reais do seu store
  const data = [
    { name: 'Seg', minutes: 120 },
    { name: 'Ter', minutes: 90 },
    { name: 'Qua', minutes: 150 },
    { name: 'Qui', minutes: 80 },
    { name: 'Sex', minutes: 100 },
    { name: 'Sáb', minutes: 60 },
    { name: 'Dom', minutes: 30 },
  ];

  const totalMinutes = data.reduce((acc, curr) => acc + curr.minutes, 0);
  const averageMinutes = Math.round(totalMinutes / data.length);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className={`p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <h2 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        Tempo de Estudo (Pomodoro)
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="minutes" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Total de Horas</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {totalHours}h {remainingMinutes}m
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Média Diária</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {averageMinutes} min
          </p>
        </div>
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm text-gray-500">Sessões</p>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {data.length}
          </p>
        </div>
      </div>
    </div>
  );
} 