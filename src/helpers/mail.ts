import { Resend } from 'resend'

import { ConfirmEmail } from '@/components/email/confirm-email'
import { ResetEmail } from '@/components/email/reset-email'
import { TwoFactorCodeEmail } from '@/components/email/two-factor-code-email'

const resend = new Resend(process.env.RESEND_API_KEY)

const domain = process.env.NEXT_PUBLIC_APP_URL

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/verification?token=${token}`

  await resend.emails.send({
    from: 'Verification <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your email',
    react: ConfirmEmail({ confirmLink }),
    text: ''
  })
}

export const sendResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/reset-password?token=${token}`

  await resend.emails.send({
    from: 'Forgot password? <onboarding@resend.dev>',
    to: email,
    subject: 'Reset your password',
    react: ResetEmail({ resetLink }),
    text: ''
  })
}

export const sendTwoFactorCodeEmail = async (email: string, code: string) => {
  await resend.emails.send({
    from: '2FA Code <onboarding@resend.dev>',
    to: email,
    subject: '2Fa Code',
    react: TwoFactorCodeEmail({ code }),
    text: ''
  })
}
