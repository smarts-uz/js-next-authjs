import { auth } from '@/auth'

export default auth(req => {})

// Optionally, don't invoke Middleware on some paths
// Matcher from clerc
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
