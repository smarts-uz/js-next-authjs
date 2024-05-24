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
import { statusMessage } from '@/messages/statusMessage'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const session = await auth()

  const currentUser = await getCurrentUser()
  if (!currentUser) return { error: statusMessage.error.unauthorized }

  const dbUser = await prisma.user.findUnique({ where: { id: session?.user?.id } })
  if (!dbUser) return { error: statusMessage.error.unauthorized }

  if (currentUser.isOAuth) {
    values.email = undefined
    values.password = undefined
    values.updatedPassword = undefined
    values.isTwoFactorEnabled = undefined
  }

  if (values.email && values.email !== currentUser.email) {
    const existingUser = await getUserByEmail(values.email)
    if (existingUser && existingUser.id !== currentUser.id)
      return { error: statusMessage.error.emailTaken }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: statusMessage.success.verificationEmail }
  }

  if (values.password && values.updatedPassword && dbUser.password) {
    const isPasswordValid = await matchPasswords(values.password, dbUser.password)
    if (!isPasswordValid) return { error: statusMessage.error.passwordInvalid }

    if (values.password === values.updatedPassword)
      return { error: statusMessage.error.passwordIdentical }

    const hashedPassword = await bcrypt.hash(values.updatedPassword, 10)

    values.password = hashedPassword
    values.updatedPassword = undefined
  }

  if (values.password && !values.updatedPassword) {
    const hashedPassword = await bcrypt.hash(values.password, 10)
    values.password = hashedPassword
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  })

  return { success: statusMessage.success.profileUpdated }
}
