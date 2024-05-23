import crypto from 'crypto'

import { v4 as uuidv4 } from 'uuid'

import { prisma } from '@/lib/db'
import { getVerificationTokenByEmail } from '@/helpers/verification-tokens'
import { getResetTokenByEmail } from '@/helpers/reset-tokens'
import { getTwoFactorCodeByEmail } from '@/helpers/two-factor-code'

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  // If verification token already exists delete it and generate new
  const existingToken = await getVerificationTokenByEmail(email)
  if (existingToken) {
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    })
  }

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return verificationToken
}

export const generateResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 3600 * 1000)

  const existingToken = await getResetTokenByEmail(email)
  if (existingToken) {
    await prisma.resetToken.delete({
      where: { id: existingToken.id }
    })
  }

  const resetToken = await prisma.resetToken.create({
    data: {
      email,
      token,
      expires
    }
  })

  return resetToken
}

export const generateTwoFactorCode = async (email: string) => {
  const code = crypto.randomInt(100_000, 1_000_000).toString()
  const expires = new Date(new Date().getTime() + 600 * 1000) // 10 min

  const existingCode = await getTwoFactorCodeByEmail(email)
  if (existingCode) {
    await prisma.twoFactorCode.delete({
      where: { id: existingCode.id }
    })
  }

  const twoFactorCode = await prisma.twoFactorCode.create({
    data: {
      email,
      code,
      expires
    }
  })

  return twoFactorCode
}
