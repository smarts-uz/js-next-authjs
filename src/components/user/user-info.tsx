'use client'

import { FcMultipleDevices, FcServices } from 'react-icons/fc'

import { ExtendedUser } from '@/auth'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { handleClickToCopy } from '@/helpers/click-to-copy'

interface UserInfoProps {
  user?: ExtendedUser
  type?: string
  label: string
}

export const UserInfo = ({ user, type, label }: UserInfoProps) => {
  return (
    <Card className="shadow-md w-full sm:w-[600px] px-0">
      <CardHeader className="flex flex-row items-center justify-center pt-5">
        {type === 'server' ? (
          <FcServices className="h-7 w-7 mr-2" />
        ) : (
          <FcMultipleDevices className="h-7 w-7 mr-2" />
        )}
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4 px-3 pb-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">ID</p>
          <p
            className="truncate text-xs max-w-[200px] font-mono p-1 bg-slate-100 rounded-md cursor-copy"
            onClick={() => user?.id && handleClickToCopy(user?.id)}
          >
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Name</p>
          <p
            className="truncate text-xs max-w-[200px] font-mono p-1 bg-slate-100 rounded-md cursor-copy"
            onClick={() => user?.name && handleClickToCopy(user?.name)}
          >
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Email</p>
          <p
            className="truncate text-xs max-w-[200px] font-mono p-1 bg-slate-100 rounded-md cursor-copy"
            onClick={() => user?.email && handleClickToCopy(user?.email)}
          >
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">Role</p>
          <p
            className="truncate text-xs max-w-[200px] font-mono p-1 bg-slate-100 rounded-md cursor-copy"
            onClick={() => user?.role && handleClickToCopy(user?.role)}
          >
            {user?.role}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">2FA</p>
          <p
            className={
              'truncate text-xs max-w-[200px] font-mono py-1 px-1.5 rounded-md text-white ' +
              `${user?.isTwoFactorEnabled ? 'bg-emerald-800' : 'bg-red-800'}`
            }
          >
            {user?.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
