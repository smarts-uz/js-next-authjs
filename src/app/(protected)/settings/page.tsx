import { auth, signOut } from '@/auth'

export default async function SettingsPage() {
  const session = await auth()

  return (
    <main>
      <h1>Settings Page</h1>
      <p>Session: {JSON.stringify(session)}</p>
      <form
        action={async () => {
          'use server'

          await signOut()
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </main>
  )
}
