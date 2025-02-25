import bcrypt from 'bcryptjs'
import Google from 'next-auth/providers/google'
import Yandex from 'next-auth/providers/yandex'
import Github from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

import { getUserByEmail } from '@/helpers/users'
import { LoginSchema } from '@/schemas'

import type { NextAuthConfig } from 'next-auth'

export default {
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET
    }),
    Yandex({
      clientId: process.env.NEXT_PUBLIC_YANDEX_ID,
      clientSecret: process.env.NEXT_PUBLIC_YANDEX_SECRET
    }),
    Github({
      clientId: process.env.NEXT_PUBLIC_GITHUB_ID,
      clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const user = await getUserByEmail(email)
          if (!user || !user.password) return null

          const isPasswordsMatch = await bcrypt.compare(password, user.password)
          if (isPasswordsMatch) return user
        }

        return null
      }
    })
  ],
  secret: process.env.NEXT_PUBLIC_SECRET
} satisfies NextAuthConfig
