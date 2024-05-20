import NextAuth from 'next-auth'

import authConfig from '@/auth.config'

export const { auth } = NextAuth(authConfig)

export default auth(req => {})

// Matcher from clerc
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
