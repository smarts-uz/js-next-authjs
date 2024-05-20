import * as React from 'react'

interface EmailTemplateProps {
  confirmLink: string
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  confirmLink
}) => (
  <div>
    <h1>Hi!</h1>
    <p>
      Click <a href={confirmLink}>here</a> to confirm your email.
    </p>
  </div>
)
