import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '../contexts/authContextDef';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
};

export type { AuthContextType };
