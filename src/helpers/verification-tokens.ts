import { prisma } from '@/lib/db'

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = prisma.verificationToken.findFirst({
      where: { email }
    })

    return verificationToken
  } catch (e) {
    return null
  }
}

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = prisma.verificationToken.findUnique({
      where: { token }
    })

    return verificationToken
  } catch (e) {
    return null
  }
}
