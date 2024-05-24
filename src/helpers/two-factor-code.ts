import { prisma } from '@/lib/db'

export const getTwoFactorCodeByEmail = async (email: string) => {
  try {
    const twoFactorCode = await prisma.twoFactorCode.findFirst({
      where: { email }
    })

    return twoFactorCode
  } catch (e) {
    return null
  }
}
