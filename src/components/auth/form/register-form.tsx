'use client'

import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { RegisterSchema } from '@/schemas'
import { register } from '@/actions/register'
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
import { statusMessage } from '@/messages/statusMessage'

export const RegisterForm = () => {
  const [success, setSuccess] = useState<string | undefined>('')
  const [error, setError] = useState<string | undefined>('')

  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      name: ''
    }
  })

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setSuccess('')
    setError('')

    startTransition(() => {
      register(values).then(data => {
        setSuccess(data.success)
        setError(data.error)
      })
    })
  }

  return (
    <CardWrapper
      headerTitle="Create an account"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocials
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="inline">Name</FormLabel>
                  <FormMessage className="inline" />
                  <FormControl>
                    <Input {...field} placeholder="Your Name" disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />

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
                    <Input {...field} placeholder="********" type="password" disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormSuccess message={success} />
          <FormError message={error} />
          <FormError message={statusMessage.error.credentialsAuth} />

          <Button type="submit" className="w-full" disabled={isPending}>
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
