// Routes that don't require authentication
export const publicRoutes = ['/', '/auth/verification']

// Routes that redirect logged-in users to DEFAULT_LOGIN_REDIRECT
export const authRoutes = ['/auth/login', '/auth/register', '/auth/error']

export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = '/settings'
