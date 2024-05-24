'use server'

import bcrypt from 'bcryptjs'
import * as z from 'zod'

import { ResetPasswordSchema } from '@/schemas'
import { prisma } from '@/lib/db'
import { getResetTokenByToken } from '@/helpers/reset-tokens'
import { getUserByEmail } from '@/helpers/users'
import { statusMessage } from '@/messages/statusMessage'

export const update = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: statusMessage.error.resetTokenNotProvided }

  const validatedFields = ResetPasswordSchema.safeParse(values)
  if (!validatedFields.success) return { error: statusMessage.error.passwordInvalid }

  const existingToken = await getResetTokenByToken(token)
  if (!existingToken) return { error: statusMessage.error.resetTokenNotFound }

  const isTokenExpired = new Date(existingToken.expires) < new Date()
  if (isTokenExpired) return { error: statusMessage.error.resetTokenExpired }

  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) return { error: statusMessage.error.emailInvalid }

  const { password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  })

  await prisma.resetToken.delete({
    where: { id: existingToken.id }
  })

  return { success: statusMessage.success.passwordUpdated }
}
