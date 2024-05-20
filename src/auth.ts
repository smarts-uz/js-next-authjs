import NextAuth, { type DefaultSession } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'

import { getUserById } from '@/helpers/users'
import { UserRole } from '@prisma/client'
import { prisma } from '@/lib/db'
import authConfig from '@/auth.config'

declare module 'next-auth' {
  interface Session {
    user: {
      role: UserRole
    } & DefaultSession['user']
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
      // Prevent credentials sign in without email verified
      if (account?.provider === 'credentials' && user?.id) {
        const existingUser = await getUserById(user.id)

        if (!existingUser?.emailVerified) return false
      }

      // OAuth always allowed without email verification
      return true
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        // Token.sub equals user id
        session.user.id = token.sub
      }

      if (token.role && session.user) {
        // Extending role from token and provide to current session
        session.user.role = token.role as UserRole
      }

      return session
    },
    async jwt({ token }) {
      if (!token.sub) return token

      const existingUser = await getUserById(token.sub)
      if (!existingUser) return token

      token.role = existingUser.role
      return token
    }
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig
})
