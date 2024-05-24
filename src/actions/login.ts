'use server'

import { AuthError } from 'next-auth'
import * as z from 'zod'

import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { getUserByEmail } from '@/helpers/users'
import { generateVerificationToken, generateTwoFactorCode } from '@/helpers/tokens'
import { sendVerificationEmail, sendTwoFactorCodeEmail } from '@/helpers/mail'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getTwoFactorCodeByEmail } from '@/helpers/two-factor-code'
import { prisma } from '@/lib/db'
import { getTwoFactorConfirmationByUserId } from '@/helpers/two-factor-confirmation'
import { matchPasswords } from '@/helpers/passwords'
import { statusMessage } from '@/messages/statusMessage'

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values)
  if (!validatedFields.success) return { error: statusMessage.error.incorrectFields }

  const { email, password, code } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  // User is not exist or registered using OAuth provider
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: statusMessage.error.incorrectFields }
  }

  const isPasswordsMatch = await matchPasswords(password, existingUser?.password)

  // User exist but not verified email
  if (!existingUser.emailVerified) {
    if (isPasswordsMatch) {
      const verificationToken = await generateVerificationToken(existingUser.email)
      await sendVerificationEmail(verificationToken.email, verificationToken.token)

      return { success: statusMessage.success.confirmationEmail }
    } else return { error: statusMessage.error.incorrectFields }
  }

  // User exist but not completed 2fa
  if (existingUser.isTwoFactorEnabled && existingUser.email && isPasswordsMatch) {
    if (code) {
      const twoFactorCode = await getTwoFactorCodeByEmail(existingUser.email)
      if (!twoFactorCode) return { error: statusMessage.error.codeNotFound }
      if (twoFactorCode.code !== code) return { error: statusMessage.error.codeInvalid }

      const hasExpired = new Date(twoFactorCode.expires) < new Date()
      if (hasExpired) return { error: statusMessage.error.codeExpired }

      await prisma.twoFactorCode.delete({ where: { id: twoFactorCode.id } })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({ where: { id: existingConfirmation.id } })
      }

      await prisma.twoFactorConfirmation.create({
        data: { userId: existingUser.id }
      })
    } else {
      const twoFactorCode = await generateTwoFactorCode(existingUser.email)
      await sendTwoFactorCodeEmail(twoFactorCode.email, twoFactorCode.code)

      return { isTwoFactorEnabled: true }
    }
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: statusMessage.error.incorrectFields }
        default:
          return { error: statusMessage.error.unexpectedError }
      }
    }

    // Have to trow an error otherwise it will not redirect to DEFAULT_LOGIN_REDIRECT
    throw error
  }
}
