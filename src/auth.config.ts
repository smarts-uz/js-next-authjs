import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Yandex from 'next-auth/providers/yandex'
import Github from 'next-auth/providers/github'
import Credentials from 'next-auth/providers/credentials'

import { LoginSchema } from '@/schemas'
import { getUserByEmail } from '@/helpers/users'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Yandex({
      clientId: process.env.YANDEX_CLIENT_ID,
      clientSecret: process.env.YANDEX_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
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
  ]
} satisfies NextAuthConfig
