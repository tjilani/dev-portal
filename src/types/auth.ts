export interface SignInState {
  success: boolean;
  data?: { email: string; needsVerification?: boolean };
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  data?: {
    id: string;
    name: string | null;
    email: string | null;
    verificationRequired: boolean;
    emailSent: boolean;
  };
  error?: string;
}

export interface ResendVerificationResult {
  success: boolean;
  error?: string;
}

export interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
