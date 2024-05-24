'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { SettingsSchema } from '@/schemas'
import { getCurrentUser } from '@/helpers/current-user'
import { prisma } from '@/lib/db'
import { auth } from '@/auth'
import { getUserByEmail } from '@/helpers/users'
import { generateVerificationToken } from '@/helpers/tokens'
import { sendVerificationEmail } from '@/helpers/mail'
import { matchPasswords } from '@/helpers/passwords'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const session = await auth()

  const currentUser = await getCurrentUser()
  if (!currentUser) return { error: 'Unauthorized!' }

  const dbUser = await prisma.user.findUnique({ where: { id: session?.user?.id } })
  if (!dbUser) return { error: 'Unauthorized!' }

  if (currentUser.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.updatedPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.email && values.email !== currentUser.email) {
    const existingUser = await getUserByEmail(values.email)
    if (existingUser && existingUser.id !== currentUser.id)
      return { error: 'Email already in use!' }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: 'Verification email sent!' }
  }

  if (values.password && values.updatedPassword && dbUser.password) {
    const isPasswordValid = await matchPasswords(values.password, dbUser.password)
    if (!isPasswordValid) return { error: 'Invalid password provided!' }
    if (values.password === values.updatedPassword)
      return { error: 'Updated password same as current!' }

    const hashedPassword = await bcrypt.hash(values.updatedPassword, 10)

    values.password = hashedPassword
    values.updatedPassword = undefined
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  })

  return { success: 'Profile updated successfully!' }
}
