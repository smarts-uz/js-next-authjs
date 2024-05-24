'use server'

import * as z from 'zod'

import { ForgotPasswordSchema } from '@/schemas'
import { getUserByEmail } from '@/helpers/users'
import { generateResetToken } from '@/helpers/tokens'
import { sendResetEmail } from '@/helpers/mail'
import { statusMessage } from '@/messages/statusMessage'

export const reset = async (values: z.infer<typeof ForgotPasswordSchema>) => {
  const validatedFields = ForgotPasswordSchema.safeParse(values)
  if (!validatedFields.success) return { error: statusMessage.error.emailInvalid }

  const { email } = validatedFields.data
  const existingUser = await getUserByEmail(email)
  if (!existingUser) return { error: statusMessage.error.emailInvalid }

  const resetToken = await generateResetToken(email)
  await sendResetEmail(resetToken.email, resetToken.token)

  return { success: statusMessage.success.resetEmail }
}
