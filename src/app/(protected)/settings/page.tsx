'use client'

import { logout } from '@/actions/logout'

export default function SettingsPage() {
  const handleLogout = () => logout()

  return (
    <main className="bg-white p-10 rounded-xl">
      <button onClick={handleLogout} type="submit">
        Sign Out
      </button>
    </main>
  )
}
