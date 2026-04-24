import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import type { User } from '../types/api.types';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: User['role'];
}

export const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // If user tries to access a route they don't have permission for,
    // redirect them to their respective dashboard
    const redirectPath = user.role === 'ADMIN' ? '/admin' : '/agent';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
