import {FormEvent, useState} from 'react'
import Link from 'next/link'
import {EmailAuthProvider, GoogleAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, signOut} from 'firebase/auth'
import {auth} from '../../lib/firebase'
import {useAuth} from '../../hooks/useAuth'

export default function DeleteAccountPage() {
  const {user, loading} = useAuth()
  const [confirmation, setConfirmation] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [deleted, setDeleted] = useState(false)
  const passwordLogin = user?.providerData.some(provider => provider.providerId === 'password')
  const googleLogin = user?.providerData.some(provider => provider.providerId === 'google.com')
  const [method, setMethod] = useState<'password' | 'google'>('password')
  const useGoogle = !!googleLogin && (!passwordLogin || method === 'google')

  async function removeAccount(event: FormEvent) {
    event.preventDefault()
    if (!user || busy || confirmation !== 'DELETE') return
    setBusy(true); setError('')
    try {
      if (useGoogle) await reauthenticateWithPopup(user, new GoogleAuthProvider())
      else if (passwordLogin && user.email)
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password))
      else throw new Error('Please sign in again using your account provider before deleting.')
      setPassword('')
      const response = await fetch('/api/account/delete', {
        method: 'POST', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${await user.getIdToken(true)}`},
        body: JSON.stringify({confirmation}),
      })
      const result = await response.json()
      if (!response.ok || !result.deleted) throw new Error(result.error || 'Deletion did not complete. Please retry.')
      setDeleted(true)
      await signOut(auth).catch(() => {})
    } catch (failure: any) {
      const code = failure?.code
      setError(code === 'auth/invalid-credential' || code === 'auth/wrong-password' ? 'Password is incorrect. Try again.' :
        code === 'auth/popup-closed-by-user' ? 'Google verification was canceled. Your deletion was not submitted.' :
        code === 'auth/popup-blocked' ? 'Allow the Google sign-in popup and try again.' :
        failure instanceof Error ? failure.message : 'Deletion could not finish. Please retry.')
    } finally {setBusy(false)}
  }

  if (deleted) return <main className="mx-auto max-w-xl px-4 py-12"><h1 className="text-2xl font-bold">Your account has been deleted</h1><p className="mt-3">Your profile and sign-in account have been removed.</p><Link href="/" className="mt-6 inline-block underline">Return home</Link></main>
  if (loading) return <p className="p-6">Loading account…</p>
  if (!user) return <main className="mx-auto max-w-xl px-4 py-12"><h1 className="text-2xl font-bold">Delete your profile and account</h1><p className="mt-3">Sign in to delete your own account.</p><Link href="/login" className="mt-6 inline-block rounded-lg bg-red-600 px-5 py-3 font-bold text-white">Log in</Link></main>
  return <main className="mx-auto max-w-xl px-4 py-10">
    <Link href="/profile" className="underline">Back to your profile</Link>
    <h1 className="mt-6 text-2xl font-bold">Delete your profile and account</h1>
    <p className="mt-3">This permanently removes your profile, sign-in account, profile and coach uploads, stories, and your posts in your profile, state communities, and Coaches Corner. Your live broadcasts are removed too.</p>
    <p className="mt-3">Comments, likes, reposts, mentions, and Arena history on other people’s content may remain. Some older community uploads need support to remove. Files others downloaded are outside this account.</p>
    <p className="mt-3 font-semibold">This cannot be undone. Save anything you want to keep first.</p>
    <form onSubmit={removeAccount} className="mt-6 space-y-5">
      <fieldset disabled={busy} className="space-y-5">
        <legend className="mb-3 font-semibold">Deleting: {user.email || user.displayName || 'your account'}</legend>
        {passwordLogin && googleLogin && <label className="block">Verify with<select value={method} onChange={event => setMethod(event.target.value as 'password' | 'google')} className="mt-2 w-full rounded-lg border p-3 text-black"><option value="password">Password</option><option value="google">Google</option></select></label>}
        {!useGoogle && passwordLogin && <label className="block">Current password<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} className="mt-2 w-full rounded-lg border p-3 text-black" /></label>}
        {useGoogle && <p>Google will ask you to verify your sign-in when you press Delete.</p>}
        <label className="block">Type <strong>DELETE</strong> to confirm<input value={confirmation} onChange={event => setConfirmation(event.target.value)} autoComplete="off" spellCheck={false} className="mt-2 w-full rounded-lg border p-3 text-black" /></label>
        <button disabled={confirmation !== 'DELETE' || busy} className="min-h-12 w-full rounded-lg bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? 'Deleting your account… Keep this page open.' : 'Permanently delete my account'}</button>
      </fieldset>
      {error && <p role="alert" className="rounded-lg border border-red-500 p-3">{error}</p>}
      <Link href="/profile" className="inline-block py-3 underline" aria-disabled={busy} onClick={event => {if (busy) event.preventDefault()}}>Cancel</Link>
    </form>
  </main>
}
