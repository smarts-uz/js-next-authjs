import { prisma } from '@/lib/db'

export const getResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await prisma.resetToken.findFirst({
      where: { email }
    })

    return resetToken
  } catch (e) {
    return null
  }
}

export const getResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await prisma.resetToken.findUnique({
      where: { token }
    })

    return resetToken
  } catch (e) {
    return null
  }
}
