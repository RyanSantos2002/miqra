import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.trim().length > 0 &&
    supabaseAnonKey.trim().length > 0 &&
    supabaseUrl.startsWith('http')
  );
};

// Se não estiver configurado no ambiente, fornecemos um cliente placeholder
// seguro para que o carregamento da aplicação nunca quebre em runtime.
const fallbackUrl = 'https://placeholder.supabase.co';
const fallbackKey = 'placeholder-key';

export const supabase: SupabaseClient = createClient(
  isSupabaseConfigured() ? (supabaseUrl as string) : fallbackUrl,
  isSupabaseConfigured() ? (supabaseAnonKey as string) : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
