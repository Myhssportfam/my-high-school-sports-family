import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signInWithEmail, signInWithGoogle } from '../lib/auth'

export default function SignIn() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent) {
  e.preventDefault()
  setError(null)
  setLoading(true)

  try {
    console.log("Starting sign-in for:", email)

    const user = await signInWithEmail({
  email: email.trim(),
  password,
})


    console.log("Signed-in user:", user.uid)

    const next =
  typeof router.query.next === "string"
    ? router.query.next
    : "/profile"

await router.replace(next)
  } catch (err: unknown) {
    console.error("Sign-in error:", err)

    const message =
      err instanceof Error ? err.message : "Sign in failed."

    setError(message)
  } finally {
    setLoading(false)
  }
}

  async function onGoogle() {
    setError(null)
    setLoading(true)
    try {
      await signInWithGoogle()
      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Google sign in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 max-w-md">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center gap-2">
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
          <button type="button" disabled={loading} onClick={onGoogle} className="px-4 py-2 border rounded">{loading ? 'Please wait...' : 'Continue with Google'}</button>
        </div>
      </form>
    </div>
  )
}
