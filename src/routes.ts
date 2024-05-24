// Routes that don't require authentication
export const publicRoutes = ['/', '/auth/verification']

// Routes that redirect logged-in users to DEFAULT_LOGIN_REDIRECT
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/forgot-password',
  '/auth/reset-password'
]

export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = '/settings'
export const DEFAULT_LOGOUT_REDIRECT = '/auth/login'
