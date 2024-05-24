'use client'

import { FcServices } from 'react-icons/fc'
import { useState, useTransition } from 'react'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UserRole } from '@prisma/client'
import { useSession } from 'next-auth/react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { settings } from '@/actions/settings'
import { SettingsSchema } from '@/schemas'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { FormError } from '@/components/auth/form/form-error'
import { FormSuccess } from '@/components/auth/form/form-success'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition()
  const [success, setSuccess] = useState<string | undefined>()
  const [error, setError] = useState<string | undefined>()
  const { update } = useSession()
  const user = useCurrentUser()

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      updatedPassword: undefined,
      name: user?.name || undefined,
      role: user?.role || undefined,
      email: user?.email || undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined
    }
  })

  const handleUpdateProfile = (values: z.infer<typeof SettingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then(data => {
          if (data.success) {
            update()
            setSuccess(data.success)
          }
          if (data.error) setError(data.error)
        })
        .catch(() => setError('Something went wrong!'))
    })
  }

  return (
    <Card className="shadow-md w-full sm:w-[600px] px-0">
      <CardHeader className="flex flex-row items-center justify-center pt-5">
        <FcServices className="h-7 w-7 mr-2" />
        <p className="text-2xl font-semibold text-center">Settings</p>
      </CardHeader>
      <CardContent className="space-y-4 px-3 pb-4">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(handleUpdateProfile)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Your name" disabled={isPending} />
                    </FormControl>
                  </FormItem>
                )}
              />
              {user?.isOAuth === false && (
                <>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Password</FormLabel>
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
                  <FormField
                    control={form.control}
                    name="updatedPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Updated Password</FormLabel>
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
                </>
              )}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormMessage className="inline" />
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN} className="py-2 cursor-pointer">
                          Admin
                        </SelectItem>
                        <SelectItem value={UserRole.USER} className="py-2 cursor-pointer">
                          User
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {user?.isOAuth === false && (
                <FormField
                  control={form.control}
                  name="isTwoFactorEnabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Two-factor authentication</FormLabel>
                        <FormMessage className="inline" />
                        <FormDescription>Enable 2FA for your account</FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormSuccess message={success} />
            <FormError message={error} />
            <div className="flex items-center">
              <Button
                type="submit"
                className="content-center items-center mx-auto"
                disabled={isPending}
              >
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
