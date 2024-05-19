import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().trim().min(1, ' • is required').email(),
  password: z
    .string()
    .trim()
    .min(1, ' • is required')
    .regex(/^[a-zA-Z0-9]+$/i, ' • latin letters and numbers allowed')
    .min(8, ' • at least 8 characters')
})
