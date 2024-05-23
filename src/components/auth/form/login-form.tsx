'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { login } from '@/actions/login'
import { LoginSchema } from '@/schemas'
import { CardWrapper } from '@/components/auth/card/card-wrapper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField
} from '@/components/ui/form'
import { FormError } from '@/components/auth/form/form-error'
import { FormSuccess } from '@/components/auth/form/form-success'

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const errorFromParams =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already linked to another account!'
      : ''

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [success, setSuccess] = useState<string | undefined>('')
  const [error, setError] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setSuccess('')
    setError('')

    startTransition(() => {
      login(values)
        .then(data => {
          if (data?.error) {
            form.reset()
            setError(data.error)
          }
          if (data?.success) {
            setSuccess(data.success)
          }
          if (data?.isTwoFactorEnabled) setShowTwoFactor(true)
        })
        .catch(() => setError('Something went wrong! Try again'))
    })
  }

  return (
    <CardWrapper
      headerTitle="Lovely to see you again"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="inline">2FA Code</FormLabel>
                    <FormMessage className="inline" />
                    <FormControl>
                      <Input {...field} placeholder="123456" disabled={isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline">Email</FormLabel>
                      <FormMessage className="inline" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="email@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="inline">Password</FormLabel>
                      <FormMessage className="inline" />
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <Button className="px-0 font-normal" size="sm" variant="link" asChild>
                        <Link href="/auth/forgot-password">Forgot password?</Link>
                      </Button>
                    </FormItem>
                  )}
                />
              </>
            )}
          </div>

          <FormSuccess message={success} />
          <FormError message={error || errorFromParams} />

          <Button type="submit" className="w-full" disabled={isPending}>
            {showTwoFactor ? 'Confirm' : 'Sign In'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
