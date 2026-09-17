import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Check, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout/AuthLayout';
import { useAuth } from '../../../hooks/useAuth';
import { formatAuthError } from '../../../utils/authErrors';
import type { LoginFormData, FormErrors } from '../../../types/auth';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: '',
    password: '',
    rememberMe: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = 'Informe seu e-mail de acesso.';
    }

    if (!formData.password) {
      newErrors.password = 'Informe sua senha de acesso.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setAuthError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const { error } = await signIn(formData.identifier, formData.password);

      if (error) {
        setAuthError(formatAuthError(error));
        setIsLoading(false);
      } else {
        const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/home';
        navigate(from, { replace: true });
      }
    } catch (err: unknown) {
      console.error('[Miqra Login] Erro:', err);
      setAuthError('Falha ao conectar ao servidor de autenticação. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      quote={{
        text: '“Examinai as Escrituras... são elas que testificam do conhecimento eterno e das verdades antigas.”',
        reference: '— JOÃO 5:39',
      }}
    >
      <div className={styles.authHeader}>
        <h1>Bem-vindo de volta!</h1>
        <p>Continue sua jornada de conhecimento nas Escrituras.</p>
      </div>

      {successMessage && (
        <div className={styles.successBanner} role="status">
          <CheckCircle2 size={16} />
          <span>{successMessage}</span>
        </div>
      )}

      {authError && (
        <div className={styles.fieldError} style={{ marginBottom: '18px', padding: '10px 14px', backgroundColor: 'rgba(224, 98, 85, 0.12)', border: '1px solid rgba(224, 98, 85, 0.35)', borderRadius: '6px' }} role="alert">
          <AlertCircle size={16} />
          <span>{authError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Campo E-mail ou usuário */}
        <div className={styles.field}>
          <label htmlFor="identifier">E-mail ou usuário</label>
          <div className={`${styles.inputWrapper} ${errors.identifier ? styles.hasError : ''}`}>
            <span className={styles.inputIcon} aria-hidden="true">
              <Mail size={16} strokeWidth={1.8} />
            </span>
            <input
              id="identifier"
              type="text"
              placeholder="Digite seu e-mail ou usuário"
              value={formData.identifier}
              onChange={(e) => {
                setFormData({ ...formData, identifier: e.target.value });
                if (errors.identifier) setErrors({ ...errors, identifier: undefined });
              }}
              autoComplete="username"
            />
          </div>
          {errors.identifier && (
            <div className={styles.fieldError} role="alert">
              <AlertCircle size={13} />
              <span>{errors.identifier}</span>
            </div>
          )}
        </div>

        {/* Campo Senha */}
        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ''}`}>
            <span className={styles.inputIcon} aria-hidden="true">
              <Lock size={16} strokeWidth={1.8} />
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors.password && (
            <div className={styles.fieldError} role="alert">
              <AlertCircle size={13} />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        {/* Lembrar de mim & Esqueceu senha */}
        <div className={styles.options}>
          <label className={styles.remember}>
            <input
              type="checkbox"
              className={styles.nativeCheckbox}
              checked={formData.rememberMe}
              onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
            />
            <span className={`${styles.customCheckbox} ${formData.rememberMe ? styles.checked : ''}`} aria-hidden="true">
              {formData.rememberMe && <Check size={11} className={styles.checkIcon} />}
            </span>
            <span>Lembrar de mim</span>
          </label>

          <Link to="/forgot-password">Esqueceu sua senha?</Link>
        </div>

        {/* Botão Entrar */}
        <button type="submit" className={styles.loginButton} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </>
          )}
        </button>

        {/* Separador OU */}
        <div className={styles.divider}>
          <span aria-hidden="true"></span>
          <strong>OU</strong>
          <span aria-hidden="true"></span>
        </div>

        {/* Botão Google */}
        <button type="button" className={styles.socialButton}>
          <span className={styles.socialIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.1 0 12s.6 3.7 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"
              />
            </svg>
          </span>
          <span>Entrar com Google</span>
        </button>

        {/* Botão GitHub */}
        <button type="button" className={styles.socialButton}>
          <span className={styles.socialIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </span>
          <span>Entrar com GitHub</span>
        </button>

        {/* Rodapé Criar Conta */}
        <div className={styles.register}>
          <span>Não tem uma conta?</span>
          <Link to="/register">Criar conta</Link>
        </div>
      </form>
    </AuthLayout>
  );
};
