export interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface FormErrors {
  [key: string]: string | undefined;
}
