import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { signUpWithEmail, signInWithGoogle } from '../lib/auth'

export default function SignUp() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('athlete')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signUpWithEmail({ email, password, displayName, role })
      router.push('/profile')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function onGoogle() {
    setLoading(true)
    setError(null)
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
      <h1 className="text-2xl font-bold">Create your account</h1>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 max-w-md">
        <input className="w-full p-2 border rounded" placeholder="Full name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
          <option value="athlete">Athlete</option>
          <option value="coach">Coach</option>
          <option value="parent">Parent</option>
        </select>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center gap-2">
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Creating account...' : 'Sign up'}</button>
          <button type="button" disabled={loading} onClick={onGoogle} className="px-4 py-2 border rounded">{loading ? 'Please wait...' : 'Continue with Google'}</button>
        </div>
      </form>
    </div>
  )
}
