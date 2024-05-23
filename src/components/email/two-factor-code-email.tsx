import * as React from 'react'

interface EmailProps {
  code: string
}

export const TwoFactorCodeEmail: React.FC<Readonly<EmailProps>> = ({ code }) => (
  <div>
    <h1>Hi!</h1>
    <p>This is your 2FA code: {code}</p>
  </div>
)
