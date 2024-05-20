import { Resend } from 'resend'

import { EmailTemplate } from '@/components/email/email-template'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`

  await resend.emails.send({
    from: 'Verification <onboarding@resend.dev>',
    to: email,
    subject: 'Confirm your email',
    react: EmailTemplate({ confirmLink }),
    text: ''
  })
}
