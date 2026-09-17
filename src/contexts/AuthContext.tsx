import React, { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AuthContext } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(() => isSupabaseConfigured());

  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured()) {
      return;
    }

    // 1. Obter sessão persistida inicial
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.error('[Miqra Auth] Erro ao recuperar sessão:', error);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      setIsLoading(false);
    });

    // 2. Ouvir mudanças em tempo real no estado de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('O Supabase não está configurado.') };
    }
    const result = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    return { error: result.error };
  };

  const signUp = async (email: string, password: string, displayName?: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('O Supabase não está configurado.'), data: null };
    }
    const result = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          display_name: displayName?.trim() || email.split('@')[0],
        },
      },
    });
    return {
      error: result.error,
      data: result.data ? { user: result.data.user, session: result.data.session } : null,
    };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setSession(null);
      return { error: null };
    }
    const result = await supabase.auth.signOut();
    return { error: result.error };
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('O Supabase não está configurado.') };
    }
    const redirectUrl = `${window.location.origin}/recovery`;
    const result = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    });
    return { error: result.error };
  };

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: new Error('O Supabase não está configurado.') };
    }
    const result = await supabase.auth.updateUser({
      password,
    });
    return { error: result.error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
