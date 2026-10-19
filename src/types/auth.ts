export interface SignInState {
  success: boolean;
  data?: { email: string };
  error?: string;
}

export interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
