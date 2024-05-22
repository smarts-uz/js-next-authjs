'use server'

import * as z from 'zod'

import { ResetSchema } from '@/schemas'
import { getUserByEmail } from '@/helpers/users'
import { generateResetToken } from '@/helpers/tokens'
import { sendResetEmail } from '@/helpers/mail'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Incorrect email!' }
  }

  const { email } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  if (!existingUser) {
    return { error: 'User with such email not found!' }
  }

  const resetToken = await generateResetToken(email)
  await sendResetEmail(resetToken.email, resetToken.token)

  return { success: 'Reset email sent!' }
}
