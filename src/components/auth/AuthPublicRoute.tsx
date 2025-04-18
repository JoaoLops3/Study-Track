import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AuthPublicRouteProps {
  children: React.ReactNode;
}

export const AuthPublicRoute = ({ children }: AuthPublicRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}; 