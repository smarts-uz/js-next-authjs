import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email(),
  password: z
    .string()
    .trim()
    .min(1, 'Password is required')
    .min(8, 'Must be at least 8 characters')
    .regex(/^[a-zA-Z0-9]+$/i, 'Only letters and numbers allowed')
})
