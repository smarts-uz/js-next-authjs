'use server'

import { prisma } from '@/lib/db'
import { getUserByEmail } from '@/helpers/users'
import { getVerificationTokenByToken } from '@/helpers/verification-tokens'
import { statusMessage } from '@/messages/statusMessage'

export const verification = async (token?: string | null) => {
  if (!token) return { error: statusMessage.error.verificationTokenNotProvided }

  const existingToken = await getVerificationTokenByToken(token)
  if (!existingToken) return { error: statusMessage.error.verificationTokenNotFound }

  const isTokenExpired = new Date(existingToken.expires) < new Date()
  if (isTokenExpired) return { error: statusMessage.error.verificationTokenExpired }

  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) return { error: statusMessage.error.emailInvalid }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email
    }
  })

  await prisma.verificationToken.delete({
    where: { id: existingToken.id }
  })

  return { success: statusMessage.success.emailVerified }
}
