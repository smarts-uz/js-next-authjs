'use server'

import { prisma } from '@/lib/db'
import { getUserByEmail } from '@/helpers/users'
import { getVerificationTokenByToken } from '@/helpers/verification-tokens'

export const verification = async (token?: string | null) => {
  if (!token) return { error: 'Missing verification token!' }

  const existingToken = await getVerificationTokenByToken(token)
  if (!existingToken) return { error: 'Verification token not found!' }

  const isTokenExpired = new Date(existingToken.expires) < new Date()
  if (isTokenExpired) return { error: 'Verification token has been expired!' }

  const existingUser = await getUserByEmail(existingToken.email)
  if (!existingUser) return { error: 'Invalid email address provided!' }

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

  return { success: 'Email has been verified!' }
}
