import * as React from 'react'

interface EmailProps {
  resetLink: string
}

export const ResetEmail: React.FC<Readonly<EmailProps>> = ({ resetLink }) => (
  <div>
    <h1>Hi!</h1>
    <p>
      Click <a href={resetLink}>here</a> to reset your password.
    </p>
  </div>
)
