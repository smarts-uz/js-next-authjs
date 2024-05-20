'use client'

import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Header } from '@/components/auth/card/card-header'
import { Socials } from '@/components/auth/socials'
import { BackButton } from '@/components/auth/button/back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerTitle?: string
  backButtonLabel: string
  backButtonHref: string
  showSocials?: boolean
}

export const CardWrapper = ({
  children,
  headerTitle,
  backButtonLabel,
  backButtonHref,
  showSocials
}: CardWrapperProps) => {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader>
        <Header title={headerTitle} />
      </CardHeader>
      <CardContent>{children}</CardContent>

      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}

      <CardFooter>
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  )
}
