'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { ResetPasswordSchema } from '@/schemas'
import { prisma } from '@/lib/db'
import { getResetTokenByToken } from '@/helpers/reset-tokens'
import { getUserByEmail } from '@/helpers/users'

export const update = async (
  values: z.infer<typeof ResetPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: 'Missing reset password token!' }

  const validatedFields = ResetPasswordSchema.safeParse(values)
  if (!validatedFields.success) return { error: 'Password is invalid!' }

  const existingToken = await getResetTokenByToken(token)
  if (!existingToken) return { error: 'Reset password token not found!' }

  const isTokenExpired = new Date(existingToken.expires) < new Date()
  if (isTokenExpired) return { error: 'Reset password token has been expired!' }

  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) return { error: 'Invalid email address provided!' }

  const { password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  })

  await prisma.resetToken.delete({
    where: { id: existingToken.id }
  })

  return { success: 'Password successfully updated!' }
}
