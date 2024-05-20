import bcrypt from 'bcryptjs'
import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

import { LoginSchema } from '@/schemas'
import { getUserByEmail } from '@/helpers/users'

export default {
  providers: [
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
