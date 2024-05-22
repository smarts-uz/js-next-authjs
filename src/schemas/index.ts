import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().trim().min(1, ' • required').email(' • must be a valid email'),
  password: z
    .string()
    .trim()
    .min(1, ' • required')
    .regex(/^[a-zA-Z0-9]+$/i, ' • latin letters and numbers allowed')
  // .min(8, ' • at least 8 characters')
})

export const RegisterSchema = z.object({
  email: z.string().trim().min(1, ' • required').email(' • must be a valid email'),
  password: z
    .string()
    .trim()
    .min(1, ' • required')
    .regex(/^[a-zA-Z0-9]+$/i, ' • use latin letters or  numbers')
    .min(8, ' • at least 8 characters'),
  name: z.string().min(1, ' • required').min(2, ' • at least 2 characters')
})

export const ForgotPasswordSchema = z.object({
  email: z.string().trim().min(1, ' • required').email(' • must be a valid email')
})

export const ResetPasswordSchema = z.object({
  password: z
    .string()
    .trim()
    .min(1, ' • required')
    .regex(/^[a-zA-Z0-9]+$/i, ' • use latin letters or  numbers')
    .min(8, ' • at least 8 characters')
})
