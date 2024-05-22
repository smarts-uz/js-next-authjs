'use client'

import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { ForgotPasswordSchema } from '@/schemas'
import { reset } from '@/actions/reset'
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

export const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState<string | undefined>('')
  const [error, setError] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
    setSuccess('')
    setError('')

    startTransition(() => {
      reset(values).then(data => {
        setSuccess(data?.success)
        setError(data?.error)
      })
    })
  }

  return (
    <CardWrapper
      headerTitle="Forgot your password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
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
          </div>

          <FormSuccess message={success} />
          <FormError message={error} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
