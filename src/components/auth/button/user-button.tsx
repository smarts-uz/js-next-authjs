'use client'

import { FaUser } from 'react-icons/fa'
import { LuLogOut } from 'react-icons/lu'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LogoutButton } from '@/components/auth/button/logout-button'

export const UserButton = () => {
  const user = useCurrentUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ''} />
          <AvatarFallback className="bg-yellow-500">
            <FaUser className="text-white size-5" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
          <DropdownMenuItem className="py-2 cursor-pointer">
            <LuLogOut className="h-4 mr-2" /> Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
