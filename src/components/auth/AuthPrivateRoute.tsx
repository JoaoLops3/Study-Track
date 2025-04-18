import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface AuthPrivateRouteProps {
  children: React.ReactNode;
}

export const AuthPrivateRoute = ({ children }: AuthPrivateRouteProps) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}; 