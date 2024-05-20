import { FcSupport } from 'react-icons/fc'

import { CardWrapper } from '@/components/auth/card/card-wrapper'

export default function AuthErrorPage() {
  return (
    <CardWrapper backButtonLabel="Back to login" backButtonHref="/auth/login">
      <div className="flex justify-center items-center gap-3">
        <FcSupport className="h-6 w-6" />
        <p>Oops! Something went wrong!</p>
      </div>
    </CardWrapper>
  )
}
