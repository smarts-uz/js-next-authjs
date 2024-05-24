import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { UserRole } from '@prisma/client'

import authConfig from '@/auth.config'
import { prisma } from '@/lib/db'
import { getUserById } from '@/helpers/users'
import { getTwoFactorConfirmationByUserId } from '@/helpers/two-factor-confirmation'
import { getAccountByUserID } from '@/helpers/account'

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole
  isTwoFactorEnabled: boolean
  isOAuth: boolean
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error'
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() }
      })
    }
  },
  callbacks: {
    async signIn({ user, account }) {
      // OAuth sign-in always allowed without email verification
      if (account?.type !== 'credentials') return true

      if (user.id) {
        const existingUser = await getUserById(user.id)

        // Prevent sign-in using credentials without verified email
        if (!existingUser?.emailVerified) return false

        // Prevent sign-in using credentials without completed 2fa
        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
          if (!twoFactorConfirmation) return false

          // Delete 2fa confirmation before each login
          await prisma.twoFactorConfirmation.delete({
            where: { id: twoFactorConfirmation.id }
          })
        }
      }

      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        // Token.sub equals user id
        session.user.id = token.sub
      }

      if (session.user) {
        // Extending property from token and provide to current session
        return {
          ...session,
          user: {
            ...session.user,
            name: token.name,
            email: token.email,
            role: token.role,
            isTwoFactorEnabled: token.isTwoFactorEnabled,
            isOAuth: token.isOAuth
          }
        }
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      const existingAccount = await getAccountByUserID(existingUser.id)

      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      token.isOAuth = Boolean(existingAccount)

      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig
})
