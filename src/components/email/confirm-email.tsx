import * as React from 'react'

interface EmailProps {
  confirmLink: string
}

export const ConfirmEmail: React.FC<Readonly<EmailProps>> = ({
  confirmLink
}) => (
  <div>
    <h1>Hi!</h1>
    <p>
      Click <a href={confirmLink}>here</a> to confirm your email.
    </p>
  </div>
)
