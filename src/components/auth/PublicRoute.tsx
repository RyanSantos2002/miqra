import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const PublicRoute: React.FC = () => {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user && session) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};
