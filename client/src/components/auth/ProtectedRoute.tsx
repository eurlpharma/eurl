import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Preloader from '../global/Preloader';

interface ProtectedRouteProps {
  children: ReactNode;
  isAdminRoute?: boolean;
}

const ProtectedRoute = ({ children, isAdminRoute = false }: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <Preloader />
    );
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If admin route but user is not admin, redirect to home
  if (isAdminRoute && user?.role?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has proper permissions
  return <>{children}</>;
};

export default ProtectedRoute;
