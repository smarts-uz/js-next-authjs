import { RegisterForm } from '@/components/auth/form/register-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '',
  description: ''
}

export default function RegisterPage() {
  return <RegisterForm />
}
