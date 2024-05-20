'use client'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'

import { LoginSchema } from '@/schemas'
import { login } from '@/actions/login'
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
      login(values).then(data => {
        setSuccess(data?.success)
        setError(data?.error)
      })
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
                </FormItem>
              )}
            />
          </div>

          <FormSuccess message={success} />
          <FormError message={error || errorFromParams} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Sign In
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
