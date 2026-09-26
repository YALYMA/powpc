import { z } from 'zod';

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Prenom trop court').max(60),
    lastName: z.string().min(2, 'Nom trop court').max(60),
    email: z.string().email('Email invalide').toLowerCase(),
    phone: z
      .string()
      .min(9, 'Telephone invalide')
      .max(20)
      .regex(/^[0-9+\s]+$/, 'Telephone invalide'),
    whatsapp: z.string().max(20).optional().or(z.literal('')),
    password: z.string().min(8, '8 caracteres minimum').max(72),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  });

export const loginSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase(),
  password: z.string().min(1, 'Mot de passe requis')
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide').toLowerCase()
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8, '8 caracteres minimum').max(72),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  });

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
