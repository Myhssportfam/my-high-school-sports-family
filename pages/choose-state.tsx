import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import { updateUserProfile } from '../lib/auth'
import { stateCommunities } from '../lib/stateCommunities'

export default function ChooseStatePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile(user?.uid)
  const [stateId, setStateId] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const changingState = router.query.change === '1'

  useEffect(() => {
    if (!router.isReady) return
    const requestedState = router.query.stateId
    if (typeof requestedState === 'string' && stateCommunities.some(([, id]) => id === requestedState)) {
      setStateId(requestedState)
    }
  }, [router.isReady, router.query.stateId])

  useEffect(() => {
    if (!authLoading && !user) router.replace('/signup')
  }, [authLoading, user, router])

  useEffect(() => {
    if (!authLoading && !profileLoading && profile?.state && profile?.stateId && !changingState) {
      router.replace('/profile')
    }
  }, [authLoading, profileLoading, profile, router, changingState])

  async function joinState(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user || !stateId) return
    const chosen = stateCommunities.find(([, id]) => id === stateId)
    if (!chosen) return
    setSaving(true)
    setError('')
    try {
      await updateUserProfile(user.uid, {
        state: chosen[0],
        stateId: chosen[1],
        stateCommunity: chosen[0],
      })
      await router.replace('/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join your state community.')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || profileLoading) return <main className="p-8">Loading...</main>

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-white">
      <form onSubmit={joinState} className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm font-bold uppercase tracking-widest text-red-400">Sports identity</p>
        <h1 className="mt-3 text-3xl font-black">{changingState ? 'Change your State Community' : 'Choose your State Community'}</h1>
        <p className="mt-3 text-slate-300">Pick the state you represent. It will appear on your profile and count you as a member of that community.</p>
        {changingState && profile?.state && <p className="mt-3 text-sm text-slate-300">Current community: {profile.state}</p>}
        <label htmlFor="state-community" className="mt-8 block text-sm font-bold">State Community</label>
        <select id="state-community" required value={stateId} onChange={(event) => setStateId(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-950">
          <option value="">Choose your state</option>
          {stateCommunities.map(([name, id]) => <option key={id} value={id}>{name}</option>)}
        </select>
        {error && <p role="alert" className="mt-3 text-red-300">{error}</p>}
        <button type="submit" disabled={!stateId || saving} className="mt-6 w-full rounded-xl bg-red-600 px-5 py-3 font-bold disabled:opacity-50">
          {saving ? 'Joining...' : 'Join State Community'}
        </button>
      </form>
    </main>
  )
}
