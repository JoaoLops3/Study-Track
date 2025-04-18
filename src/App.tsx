import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { StatisticsPage } from '@/pages/StatisticsPage';
import { CalendarPage } from '@/pages/CalendarPage';
import { useAuthStore } from '@/store/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard/calendar" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard/calendar" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/statistics" element={isAuthenticated ? <StatisticsPage /> : <Navigate to="/login" />} />
        <Route path="/dashboard/calendar" element={isAuthenticated ? <CalendarPage /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to="/dashboard/calendar" />} />
      </Routes>
    </>
  );
}

export default App;