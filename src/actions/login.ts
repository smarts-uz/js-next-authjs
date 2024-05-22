'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'
import { AuthError } from 'next-auth'

import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { getUserByEmail } from '@/helpers/users'
import { generateVerificationToken } from '@/helpers/tokens'
import { sendVerificationEmail } from '@/helpers/mail'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Incorrect email or password!' }
  }

  const { email, password } = validatedFields.data
  const existingUser = await getUserByEmail(email)

  // User is not exists in database or registered using oauth providers
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Incorrect email or password!' }
  }

  // User exists but not verified email
  if (!existingUser.emailVerified) {
    const isPasswordsMatch = await bcrypt.compare(
      password,
      existingUser.password
    )

    if (isPasswordsMatch) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      )
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      )

      return { success: 'Confirmation email sent!' }
    } else return { error: 'Incorrect email or password!' }
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
