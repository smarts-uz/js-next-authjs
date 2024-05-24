import { getCurrentUser } from '@/helpers/current-user'
import { UserInfo } from '@/components/user/user-info'

export default async function ServerPage() {
  const user = await getCurrentUser()

  return <UserInfo user={user} label="Server" type="server" />
}
