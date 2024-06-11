import { LoginForm } from '@/components/auth/form/login-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In'
}

export default function LoginPage() {
  return <LoginForm />
}
