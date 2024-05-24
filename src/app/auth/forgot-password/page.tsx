import { ForgotPasswordForm } from '@/components/auth/form/forgot-password-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '',
  description: ''
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
