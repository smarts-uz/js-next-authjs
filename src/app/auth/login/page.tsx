import type { Metadata } from 'next'

import { LoginForm } from '@/components/auth/form/login-form'

export const metadata: Metadata = {
  title: '',
  description: ''
}

export default function LoginPage() {
  return <LoginForm />
}
