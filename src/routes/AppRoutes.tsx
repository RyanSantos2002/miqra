import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PublicRoute } from '../components/auth/PublicRoute';
import { LoginPage } from '../pages/auth/Login/LoginPage';
import { RegisterPage } from '../pages/auth/Register/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPassword/ForgotPasswordPage';
import { HomePage } from '../pages/dashboard/Home/HomePage';
import { BibleIndexPage } from '../pages/bible/BibleIndexPage/BibleIndexPage';
import { BibleBookPage } from '../pages/bible/BibleBookPage/BibleBookPage';
import { BibleReaderPage } from '../pages/bible/BibleReaderPage/BibleReaderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Redirecionamento da raiz */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Rotas Públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/recovery" element={<ForgotPasswordPage />} />
      </Route>

      {/* Rotas Protegidas (exigem autenticação via Supabase) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<Navigate to="/home" replace />} />
        <Route path="/bible" element={<BibleIndexPage />} />
        <Route path="/bible/:book" element={<BibleBookPage />} />
        <Route path="/bible/:book/:chapter" element={<BibleReaderPage />} />
      </Route>

      {/* Rota Fallback */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};
