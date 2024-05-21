import { v4 as uuidv4 } from 'uuid'

import { getVerificationTokenByEmail } from '@/helpers/verification-tokens'
import { prisma } from '@/lib/db'

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getVerificationTokenByEmail(email)

  // If verification token already exists delete it and generate new
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: {
        id: existingToken.id
      }
    })
  }

  // Generate new verification token
  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken
}
