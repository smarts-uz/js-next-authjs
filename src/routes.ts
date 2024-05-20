// Routes that don't require authentication
export const publicRoutes = ['/']

// Routes that redirect logged-in users to DEFAULT_LOGIN_REDIRECT
export const authRoutes = ['/auth/login', '/auth/register']

export const apiAuthPrefix = '/api/auth'

export const DEFAULT_LOGIN_REDIRECT = '/settings'
