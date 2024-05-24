import { prisma } from '@/lib/db'

export const getAccountByUserID = async (userId: string) => {
  try {
    const account = await prisma.account.findFirst({
      where: { userId }
    })

    return account
  } catch (e) {
    return null
  }
}
