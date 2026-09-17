import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout/AuthLayout';
import { useAuth } from '../../../hooks/useAuth';
import { formatAuthError } from '../../../utils/authErrors';
import styles from './ForgotPasswordPage.module.css';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword, updatePassword, session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Se a rota for /recovery ou a URL contiver hash de recuperação
  const isRecoveryMode =
    location.pathname.includes('recovery') ||
    window.location.hash.includes('type=recovery');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setErrors({ email: 'Informe seu e-mail cadastrado.' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Informe um endereço de e-mail válido.' });
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { error } = await resetPassword(email);
      setIsLoading(false);

      if (error) {
        setAuthError(formatAuthError(error));
      } else {
        setSuccessMessage(
          'Se o e-mail estiver cadastrado no Miqra, enviamos as instruções para redefinição da sua senha. Verifique sua caixa de entrada e spam.'
        );
      }
    } catch (err: unknown) {
      console.error('[Miqra Recovery] Erro:', err);
      setIsLoading(false);
      setAuthError('Falha ao solicitar recuperação de senha. Tente novamente.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setSuccessMessage(null);

    const newErrors: { password?: string; confirm?: string } = {};

    if (!newPassword) {
      newErrors.password = 'Digite sua nova senha.';
    } else if (newPassword.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres.';
    }

    if (!confirmPassword) {
      newErrors.confirm = 'Confirme sua nova senha.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirm = 'As senhas não coincidem.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const { error } = await updatePassword(newPassword);
      setIsLoading(false);

      if (error) {
        setAuthError(formatAuthError(error));
      } else {
        setSuccessMessage('Sua senha foi redefinida com sucesso! Redirecionando para o login...');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2500);
      }
    } catch (err: unknown) {
      console.error('[Miqra Update Password] Erro:', err);
      setIsLoading(false);
      setAuthError('Falha ao atualizar a senha. Verifique se o link de recuperação ainda é válido.');
    }
  };

  return (
    <AuthLayout
      quote={{
        text: '“Restaurai a minha alma e guiai-me pelas veredas da justiça por amor do seu nome.”',
        reference: '— SALMOS 23:3',
      }}
    >
      <div className={styles.authHeader}>
        <h1>{isRecoveryMode && session ? 'Nova Senha' : 'Recuperação'}</h1>
        <p>
          {isRecoveryMode && session
            ? 'Crie uma nova senha de acesso segura para a sua conta.'
            : 'Informe seu e-mail para receber as instruções de redefinição de senha.'}
        </p>
      </div>

      {successMessage && (
        <div className={styles.successBanner} role="status">
          <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{successMessage}</span>
        </div>
      )}

      {authError && (
        <div
          className={styles.fieldError}
          style={{
            marginBottom: '18px',
            padding: '10px 14px',
            backgroundColor: 'rgba(224, 98, 85, 0.12)',
            border: '1px solid rgba(224, 98, 85, 0.35)',
            borderRadius: '6px',
          }}
          role="alert"
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{authError}</span>
        </div>
      )}

      {isRecoveryMode && session ? (
        /* Formulário para definir nova senha */
        <form onSubmit={handleUpdatePassword} noValidate>
          <div className={styles.field}>
            <label htmlFor="newPassword">Nova senha</label>
            <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ''}`}>
              <span className={styles.inputIcon} aria-hidden="true">
                <Lock size={16} strokeWidth={1.8} />
              </span>
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo de 6 caracteres"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                autoComplete="new-password"
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

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirmar nova senha</label>
            <div className={`${styles.inputWrapper} ${errors.confirm ? styles.hasError : ''}`}>
              <span className={styles.inputIcon} aria-hidden="true">
                <Lock size={16} strokeWidth={1.8} />
              </span>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Repita sua nova senha"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirm) setErrors({ ...errors, confirm: undefined });
                }}
                autoComplete="new-password"
              />
            </div>
            {errors.confirm && (
              <div className={styles.fieldError} role="alert">
                <AlertCircle size={13} />
                <span>{errors.confirm}</span>
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Salvando nova senha...</span>
              </>
            ) : (
              <>
                <KeyRound size={17} aria-hidden="true" />
                <span>Atualizar Senha</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* Formulário para solicitar envio de e-mail */
        <form onSubmit={handleSendEmail} noValidate>
          <div className={styles.field}>
            <label htmlFor="recoveryEmail">E-mail cadastrado</label>
            <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ''}`}>
              <span className={styles.inputIcon} aria-hidden="true">
                <Mail size={16} strokeWidth={1.8} />
              </span>
              <input
                id="recoveryEmail"
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: undefined });
                }}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className={styles.fieldError} role="alert">
                <AlertCircle size={13} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className={styles.spinner} aria-hidden="true" />
                <span>Enviando link...</span>
              </>
            ) : (
              <>
                <span>Enviar link de recuperação</span>
                <span style={{ fontSize: '18px', lineHeight: 1 }} aria-hidden="true">→</span>
              </>
            )}
          </button>
        </form>
      )}

      <div className={styles.footerActions}>
        <Link to="/login" className={styles.backLink}>
          <ArrowLeft size={14} />
          <span>Voltar para o login</span>
        </Link>
      </div>
    </AuthLayout>
  );
};
