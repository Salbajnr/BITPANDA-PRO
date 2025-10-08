import { api } from '@/lib/api';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const OtpSchema = z.object({
  email: z.string().email(),
  token: z.string().length(6, "OTP must be 6 digits"),
  type: z.enum(['registration', 'password_reset', '2fa']),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

const ResetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export type LoginData = z.infer<typeof LoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type OtpData = z.infer<typeof OtpSchema>;
export type ForgotPasswordData = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

// Use a more specific type for API errors
interface ApiError extends Error {
  response?: {
    data?: {
      error?: string;
    };
  };
}

async function handleRequest<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request();
  } catch (error) {
    const apiError = error as ApiError;
    const errorMessage = apiError.response?.data?.error || 'An unexpected error occurred.';
    throw new Error(errorMessage);
  }
}

export const authService = {
  login: (data: LoginData) => handleRequest(() => api.post('/auth/login', data)),
  register: (data: RegisterData) => handleRequest(() => api.post('/auth/register', data)),
  sendOtp: (data: OtpData) => handleRequest(() => api.post('/auth/send-otp', data)),
  verifyOtp: (data: OtpData) => handleRequest(() => api.post('/auth/verify-otp', data)),
  forgotPassword: (data: ForgotPasswordData) => handleRequest(() => api.post('/auth/forgot-password', data)),
  resetPassword: (data: ResetPasswordData) => handleRequest(() => api.post('/auth/reset-password', data)),
};
