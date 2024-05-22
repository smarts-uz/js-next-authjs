'use client'

import { useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { ResetPasswordSchema } from '@/schemas'
import { update } from '@/actions/update'
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

export const ResetPasswordForm = () => {
  const [success, setSuccess] = useState<string | undefined>('')
  const [error, setError] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: ''
    }
  })

  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setSuccess('')
    setError('')

    startTransition(() => {
      update(values, token).then(data => {
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="inline">Password</FormLabel>
                  <FormMessage className="inline" />
                  <FormControl>
                    <Input {...field} placeholder="********" type="password" disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormSuccess message={success} />
          <FormError message={error} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Update password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
