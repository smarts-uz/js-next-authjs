import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { LoginButton } from '@/components/auth/login-button'

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <div className="flex flex-col items-center space-y-6 px-5">
        <div className="flex items-center">
          <h1 className="text-6xl font-semibold text-white drop-shadow-medium">
            Auth &nbsp;
          </h1>
          <Image src="/icons/lock.svg" alt="lock" width={50} height={50} />
        </div>
        <p className="text-white text-lg text-center">
          Next.js full authentication flow
        </p>
        <div>
          <LoginButton>
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  )
}
