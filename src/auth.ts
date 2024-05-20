import NextAuth from 'next-auth'
import GitHub from '@auth/core/providers/github'

export const { handlers, auth } = NextAuth({
  providers: [GitHub]
})
