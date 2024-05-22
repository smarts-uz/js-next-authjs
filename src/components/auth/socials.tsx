'use client'

import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { FaYandexInternational, FaGithub } from 'react-icons/fa'

import { Button } from '@/components/ui/button'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'

export const Socials = () => {
  const handleAuth = (provider: 'google' | 'yandex' | 'github') => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT })
  }

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button className="w-full" variant="outline" size="lg" onClick={() => handleAuth('google')}>
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button className="w-full" variant="outline" size="lg" onClick={() => handleAuth('yandex')}>
        <FaYandexInternational className="h-5 w-5 text-red-600" />
      </Button>
      <Button className="w-full" variant="outline" size="lg" onClick={() => handleAuth('github')}>
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  )
}
