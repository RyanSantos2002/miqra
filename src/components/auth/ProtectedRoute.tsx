import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { user, session, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#080d0b',
          color: '#e4c47a',
          fontFamily: 'Georgia, serif',
          gap: '16px',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(212, 168, 92, 0.25)',
            borderTopColor: '#d4a85c',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <span style={{ fontSize: '14px', letterSpacing: '0.12em' }}>
          CARREGANDO MIQRA...
        </span>
        <style>
          {`@keyframes spin { to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  if (!user || !session) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};
