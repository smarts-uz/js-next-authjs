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

  // Allow not-OAuth users to change email
  if (!currentUser.isOAuth && values.email && values.email !== currentUser.email) {
    const existingUser = await getUserByEmail(values.email)
    if (existingUser && existingUser.id !== currentUser.id)
      return { error: statusMessage.error.emailTaken }

    const verificationToken = await generateVerificationToken(values.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return { success: statusMessage.success.verificationEmail }
  }

  // Allow not-OAuth users to change password
  if (!currentUser.isOAuth && values.password && values.updatedPassword && dbUser.password) {
    const isPasswordValid = await matchPasswords(values.password, dbUser.password)
    if (!isPasswordValid) return { error: statusMessage.error.passwordInvalid }

    if (values.password === values.updatedPassword)
      return { error: statusMessage.error.passwordIdentical }

    const hashedPassword = await bcrypt.hash(values.updatedPassword, 10)

    values.password = hashedPassword
    values.updatedPassword = undefined
  }

  // Allow not-OAuth users to update profile with password filled in if it same as current
  if (!currentUser.isOAuth && values.password && !values.updatedPassword) {
    const isPasswordsMatch = await matchPasswords(values.password, dbUser.password)
    if (!isPasswordsMatch) return { error: statusMessage.error.newPasswordNotProvided }

    /* For non-OAuth users Undefined will skip password field on profile update if new password was not provided.
       Without it password rehashes on each profile update */
    values.password = undefined
  }

  // Prevent OAuth users from changing password
  if (currentUser.isOAuth && !!(values.password || values.updatedPassword)) {
    return { error: statusMessage.error.oAuthWithPassword }
  }

  // Prevent OAuth users from changing 2FA
  if (currentUser.isOAuth && values.isTwoFactorEnabled) {
    return { error: statusMessage.error.oAuthWithTwoFactor }
  }

  // Prevent OAuth users from changing email
  if (currentUser.isOAuth && values.email !== dbUser.email) {
    return { error: statusMessage.error.oAuthWithEmail }
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { ...values }
  })

  return { success: statusMessage.success.profileUpdated }
}
