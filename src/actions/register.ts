'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { RegisterSchema } from '@/schemas'
import { prisma } from '@/lib/db'
import { getUserByEmail } from '@/helpers/users'
import { sendVerificationEmail } from '@/helpers/mail'
import { generateVerificationToken } from '@/helpers/tokens'

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)
  if (!validatedFields.success) return { error: 'Incorrect email or password!' }

  const { name, email, password } = validatedFields.data

  const existingUser = await getUserByEmail(email)
  if (existingUser) return { error: 'Email is invalid or already taken!' }

  const hashedPassword = await bcrypt.hash(password, 10)
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)
  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return { success: 'Confirmation email sent!' }
}
