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

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)
  if (!validatedFields.success) return { error: 'Incorrect email or password!' }

  const { email, password, code } = validatedFields.data
  const existingUser = await getUserByEmail(email)
  const isPasswordsMatch = await matchPasswords(password, existingUser?.password)

  // User is not exist or registered using OAuth provider
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Incorrect email or password!' }
  }

  // User exist but not verified email
  if (!existingUser.emailVerified) {
    if (isPasswordsMatch) {
      const verificationToken = await generateVerificationToken(existingUser.email)
      await sendVerificationEmail(verificationToken.email, verificationToken.token)

      return { success: 'Confirmation email sent!' }
    } else return { error: 'Incorrect email or password!' }
  }

  // User exist but not completed 2fa
  if (existingUser.isTwoFactorEnabled && existingUser.email && isPasswordsMatch) {
    if (code) {
      const twoFactorCode = await getTwoFactorCodeByEmail(existingUser.email)
      if (!twoFactorCode) return { error: 'Two-factor code not found!' }
      if (twoFactorCode.code !== code) return { error: 'Invalid two-factor code!' }

      const hasExpired = new Date(twoFactorCode.expires) < new Date()
      if (hasExpired) return { error: 'Two-factor code has been expired!' }

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
      redirectTo: DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Incorrect email or password!' }
        default:
          return { error: 'Something went wrong! Try again' }
      }
    }

    // Have to trow an error otherwise it will not redirect to DEFAULT_LOGIN_REDIRECT
    throw error
  }
}
