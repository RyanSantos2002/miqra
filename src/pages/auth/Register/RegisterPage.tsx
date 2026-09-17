import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from '../../../layouts/AuthLayout/AuthLayout';
import { useAuth } from '../../../hooks/useAuth';
import { formatAuthError } from '../../../utils/authErrors';
import type { RegisterFormData, FormErrors } from '../../../types/auth';
import styles from './RegisterPage.module.css';

export const RegisterPage: React.FC = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Informe seu nome completo.';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'O nome deve conter ao menos 3 caracteres.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Informe seu endereço de e-mail.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Informe um e-mail válido.';
    }

    if (!formData.password) {
      newErrors.password = 'Crie uma senha de acesso.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve conter no mínimo 6 caracteres.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Você precisa concordar com os termos de uso para prosseguir.';
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
      const { error, data } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        setAuthError(formatAuthError(error));
        setIsLoading(false);
        return;
      }

      // Se o usuário já recebeu uma sessão direta
      if (data?.session) {
        navigate('/home', { replace: true });
        return;
      }

      // Se o Supabase exigir confirmação por e-mail
      setIsLoading(false);
      setSuccessMessage(
        'Conta criada com sucesso! Verifique sua caixa de entrada para confirmar seu e-mail antes de entrar.'
      );
    } catch (err: unknown) {
      console.error('[Miqra Register] Erro:', err);
      setAuthError('Falha ao registrar conta no Supabase. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      quote={{
        text: '“A sabedoria é a coisa principal; adquire pois a sabedoria, e com todos os teus bens adquire o entendimento.”',
        reference: '— PROVÉRBIOS 4:7',
      }}
    >
      <div className={styles.authHeader}>
        <h1>Comece sua jornada</h1>
        <p>Crie sua conta e comece a explorar as Escrituras.</p>
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
        <div className={styles.field}>
          <label htmlFor="name">Nome completo</label>
          <div className={`${styles.inputWrapper} ${errors.name ? styles.hasError : ''}`}>
            <span className={styles.inputIcon} aria-hidden="true">
              <User size={17} />
            </span>
            <input
              id="name"
              type="text"
              placeholder="Ex: Teófilo de Antioquia"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              autoComplete="name"
            />
          </div>
          {errors.name && (
            <div className={styles.fieldError} role="alert">
              <AlertCircle size={13} />
              <span>{errors.name}</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="email">E-mail</label>
          <div className={`${styles.inputWrapper} ${errors.email ? styles.hasError : ''}`}>
            <span className={styles.inputIcon} aria-hidden="true">
              <Mail size={17} />
            </span>
            <input
              id="email"
              type="email"
              placeholder="seu.email@exemplo.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
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

        <div className={styles.field}>
          <label htmlFor="password">Senha</label>
          <div className={`${styles.inputWrapper} ${errors.password ? styles.hasError : ''}`}>
            <span className={styles.inputIcon} aria-hidden="true">
              <Lock size={17} />
            </span>
            <input
              id="password"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (errors.password) setErrors({ ...errors, password: undefined });
              }}
              autoComplete="new-password"
            />
          </div>
          {errors.password && (
            <div className={styles.fieldError} role="alert">
              <AlertCircle size={13} />
              <span>{errors.password}</span>
            </div>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <div className={`${styles.inputWrapper} ${errors.confirmPassword ? styles.hasError : ''}`}>
            <span className={styles.inputIcon} aria-hidden="true">
              <Lock size={17} />
            </span>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Repita sua senha"
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({ ...formData, confirmPassword: e.target.value });
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
              }}
              autoComplete="new-password"
            />
          </div>
          {errors.confirmPassword && (
            <div className={styles.fieldError} role="alert">
              <AlertCircle size={13} />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        <label className={styles.termsRow}>
          <input
            type="checkbox"
            checked={formData.agreeTerms}
            onChange={(e) => {
              setFormData({ ...formData, agreeTerms: e.target.checked });
              if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: undefined });
            }}
          />
          <span>
            Concordo com os <a href="#termos" onClick={(e) => e.preventDefault()}>termos de uso</a> e privacidade.
          </span>
        </label>
        {errors.agreeTerms && (
          <div className={styles.fieldError} style={{ marginTop: '-16px', marginBottom: '16px' }} role="alert">
            <AlertCircle size={13} />
            <span>{errors.agreeTerms}</span>
          </div>
        )}

        <button type="submit" className={styles.submitButton} disabled={isLoading}>
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Cadastrando...</span>
            </>
          ) : (
            <>
              <span>Criar minha conta</span>
              <UserPlus size={18} aria-hidden="true" />
            </>
          )}
        </button>

        <div className={styles.loginLink}>
          <span>Já possui uma conta?</span>
          <Link to="/login">Entrar</Link>
        </div>
      </form>
    </AuthLayout>
  );
};
