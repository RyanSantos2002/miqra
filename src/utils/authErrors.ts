export const formatAuthError = (err: unknown): string => {
  if (!err) return 'Ocorreu um erro inesperado.';
  const message = (err as { message?: string }).message || String(err);

  if (message.includes('Invalid login credentials')) {
    return 'E-mail ou senha incorretos.';
  }
  if (message.includes('User already registered')) {
    return 'Este endereço de e-mail já está cadastrado.';
  }
  if (message.includes('Email not confirmed')) {
    return 'Por favor, confirme seu e-mail antes de acessar a plataforma.';
  }
  if (message.includes('Password should be at least')) {
    return 'A senha deve conter no mínimo 6 caracteres.';
  }
  if (message.includes('rate limit')) {
    return 'Muitas tentativas em pouco tempo. Aguarde alguns instantes.';
  }

  return message;
};
