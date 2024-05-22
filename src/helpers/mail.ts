import { Resend } from 'resend'

import { ConfirmEmail } from '@/components/email/confirm-email'
import { ResetEmail } from '@/components/email/reset-email'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/verification?token=${token}`

  await resend.emails.send({
    from: 'Verification <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your email',
    react: ConfirmEmail({ confirmLink }),
    text: ''
  })
}

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'Reset password <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your password',
    react: ResetEmail({ resetLink }),
    text: ''
  })
}
