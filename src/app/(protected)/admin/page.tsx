'use client'

import { FcKey } from 'react-icons/fc'
import { UserRole } from '@prisma/client'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { RollGate } from '@/components/auth/roll-gate'
import { FormSuccess } from '@/components/auth/form/form-success'
import { Button } from '@/components/ui/button'
import { admin } from '@/actions/admin'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export default function AdminPage() {
  const user = useCurrentUser()

  const handleServerAction = () => {
    admin().then(data => {
      if (data.success) toast.success(data.success)
      else toast.error(data.error)
    })
  }

  const handleApiRoute = () => {
    fetch('/api/admin').then(response => {
      if (response.ok) toast.success('Allowed API Route!')
      else toast.error('Forbidden API Route')
    })
  }

  return (
    <Card className="w-full sm:w-[600px]">
      <CardHeader className="flex flex-row items-center justify-center pt-5">
        <FcKey className="h-7 w-7 mr-1.5" />
        <p className="text-2xl font-semibold text-center">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4 px-3 pb-4">
        <RollGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You have permission!"></FormSuccess>
        </RollGate>
        {user?.role === UserRole.ADMIN && (
          <>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">API Client Route</p>
              <Button onClick={handleApiRoute}>Click To Test</Button>
            </div>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <p className="text-sm font-medium">Server Action</p>
              <Button onClick={handleServerAction}>Click To Test</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
