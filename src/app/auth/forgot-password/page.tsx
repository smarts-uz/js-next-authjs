import { ForgotPasswordForm } from '@/components/auth/form/forgot-password-form'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot your password?'
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />
}
