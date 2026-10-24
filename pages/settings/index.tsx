import Link from 'next/link'
import {useAuth} from '../../hooks/useAuth'
export default function AccountSettings() {
  const {user,loading} = useAuth()
  if (loading) return <p className="p-6">Loading account…</p>
  return <main className="mx-auto max-w-xl space-y-5 px-4 py-10">
    <h1 className="text-2xl font-bold">Account settings</h1>
    {user ? <><Link href="/profile" className="block rounded-xl border p-4 font-bold">My profile</Link>
    <Link href="/settings/delete-account" className="block rounded-xl border border-red-600 p-4 font-bold text-red-600">Delete my profile and account</Link>
    <p>Every account type can delete their own profile. To delete an individual post, open it and select Delete post. To delete a story, open your story and select Delete story.</p></> : <Link href="/login" className="inline-block rounded-lg bg-red-700 px-5 py-3 font-bold text-white">Log in to manage your account</Link>}
  </main>
}
