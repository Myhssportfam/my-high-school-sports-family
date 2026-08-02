import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useUserProfile } from '../hooks/useUserProfile'
import Link from 'next/link'
import { signOut } from '../lib/auth'
import { uploadFile } from '../lib/storage'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'

type ProfileForm = {
  displayName?: string
  bio?: string
  city?: string
  state?: string
  sports?: string
  gradYear?: number | ''
  height?: string
  weight?: string
  position?: string
  schoolId?: string
  teamId?: string
  recruiting?: string
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useUserProfile(user?.uid)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<ProfileForm>({})
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setForm({
      displayName: profile.displayName || '',
      bio: profile.bio || '',
      city: profile.city || '',
      state: profile.state || '',
      sports: (profile.sports || []).join(', '),
      gradYear: profile.gradYear || '',
      height: profile.height || '',
      weight: profile.weight || '',
      position: profile.position || '',
      schoolId: profile.schoolId || '',
      teamId: profile.teamId || '',
      recruiting: profile.recruiting?.profileUrl || ''
    })
  }, [profile])

  if (authLoading || profileLoading) return <div className="container py-8">Loading...</div>

  if (!user) {
    return (
      <div className="container py-8">
        <p>Please <Link href="/signin">sign in</Link> or <Link href="/signup">create an account</Link>.</p>
      </div>
    )
  }

  async function saveProfile() {
    if (!user) return
    setSaving(true)
    setError(null)
    try {
      const updates: any = {}
      if (form.displayName) updates.displayName = form.displayName
      if (form.bio) updates.bio = form.bio
      if (form.city) updates.city = form.city
      if (form.state) updates.state = form.state
      if (form.sports) updates.sports = form.sports.split(',').map((s) => s.trim())
      if (form.gradYear) updates.gradYear = Number(form.gradYear)
      if (form.height) updates.height = form.height
      if (form.weight) updates.weight = form.weight
      if (form.position) updates.position = form.position
      if (form.schoolId) updates.schoolId = form.schoolId
      if (form.teamId) updates.teamId = form.teamId
      if (form.recruiting) updates.recruiting = { profileUrl: form.recruiting, status: profile?.recruiting?.status || 'open' }

      if (avatarFile) {
        const path = `avatars/${user.uid}/${Date.now()}-${avatarFile.name}`
        const url = await uploadFile(avatarFile, path)
        updates.avatarUrl = url
      }
      if (coverFile) {
        const path = `covers/${user.uid}/${Date.now()}-${coverFile.name}`
        const url = await uploadFile(coverFile, path)
        updates.coverUrl = url
      }

      updates.updatedAt = serverTimestamp()
      await setDoc(doc(db, 'users', user.uid), updates, { merge: true })
      setEditing(false)
    } catch (e: any) {
      setError(e.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="relative h-40 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
        {profile?.coverUrl ? <img src={profile.coverUrl} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">Cover photo</div>}
        <div className="absolute bottom-2 left-4">
          <img src={profile?.avatarUrl || '/default-avatar.png'} alt="avatar" className="w-28 h-28 rounded-full object-cover border-4 border-white dark:border-gray-900" />
        </div>
        <div className="absolute top-4 right-4">
          <button onClick={() => setEditing((v) => !v)} className="px-3 py-1 border rounded">{editing ? 'Cancel' : 'Edit profile'}</button>
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        {!editing ? (
          <>
            <h1 className="text-2xl font-bold">{profile?.displayName}</h1>
            <div className="text-sm text-gray-600">{[profile?.city, profile?.state].filter(Boolean).join(', ')}</div>
            <div className="mt-4">{profile?.bio}</div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div><strong>Role:</strong> {profile?.role}</div>
              <div><strong>Sports:</strong> {(profile?.sports || []).join(', ')}</div>
              <div><strong>Grad Year:</strong> {profile?.gradYear || 'N/A'}</div>
              <div><strong>Height / Weight:</strong> {profile?.height || '-'} / {profile?.weight || '-'}</div>
              <div><strong>Position:</strong> {profile?.position || '-'}</div>
              <div><strong>School:</strong> {profile?.schoolId || 'Unassigned'}</div>
              <div><strong>Team:</strong> {profile?.teamId || 'Unassigned'}</div>
            </div>
            {profile?.role === 'athlete' && (
              <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold mb-2">Athlete recruiting</h2>
                <p>Status: {profile?.recruiting?.status || 'Open'}</p>
                {profile?.recruiting?.profileUrl && (
                  <a href={profile.recruiting.profileUrl} className="text-blue-600 underline">Recruiting profile link</a>
                )}
              </div>
            )}
            {profile?.role === 'coach' && (
              <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold mb-2">Coach details</h2>
                <p>Managed team: {profile?.teamId || 'TBD'}</p>
                <p>School: {profile?.schoolId || 'TBD'}</p>
              </div>
            )}
            {profile?.role === 'parent' && (
              <div className="mt-4 rounded-lg border p-4 bg-white dark:bg-gray-900">
                <h2 className="text-lg font-semibold mb-2">Parent profile</h2>
                <p>Connected athlete: {profile?.teamId || 'None specified'}</p>
                <p>Preferred sport: {(profile?.sports || []).join(', ') || 'N/A'}</p>
              </div>
            )}
            <div className="mt-4">
              <button onClick={() => signOut()} className="px-3 py-1 border rounded">Sign out</button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <input value={form.displayName || ''} onChange={(e) => setForm((s) => ({ ...s, displayName: e.target.value }))} placeholder="Full name" className="w-full p-2 border rounded" />
            <textarea value={form.bio || ''} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} placeholder="Bio" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.city || ''} onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))} placeholder="City" className="p-2 border rounded" />
              <input value={form.state || ''} onChange={(e) => setForm((s) => ({ ...s, state: e.target.value }))} placeholder="State" className="p-2 border rounded" />
            </div>
            <input value={form.sports || ''} onChange={(e) => setForm((s) => ({ ...s, sports: e.target.value }))} placeholder="Sports (comma separated)" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-3 gap-2">
              <input value={form.gradYear || ''} onChange={(e) => setForm((s) => ({ ...s, gradYear: e.target.value ? Number(e.target.value) : '' }))} placeholder="Grad Year" className="p-2 border rounded" />
              <input value={form.height || ''} onChange={(e) => setForm((s) => ({ ...s, height: e.target.value }))} placeholder="Height" className="p-2 border rounded" />
              <input value={form.weight || ''} onChange={(e) => setForm((s) => ({ ...s, weight: e.target.value }))} placeholder="Weight" className="p-2 border rounded" />
            </div>
            <input value={form.position || ''} onChange={(e) => setForm((s) => ({ ...s, position: e.target.value }))} placeholder="Position" className="w-full p-2 border rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input value={form.schoolId || ''} onChange={(e) => setForm((s) => ({ ...s, schoolId: e.target.value }))} placeholder="School ID" className="p-2 border rounded" />
              <input value={form.teamId || ''} onChange={(e) => setForm((s) => ({ ...s, teamId: e.target.value }))} placeholder="Team ID" className="p-2 border rounded" />
            </div>
            {profile?.role === 'athlete' && (
              <input value={form.recruiting || ''} onChange={(e) => setForm((s) => ({ ...s, recruiting: e.target.value }))} placeholder="Recruiting profile URL" className="w-full p-2 border rounded" />
            )}
            <div className="flex items-center gap-2">
              <label className="flex-1">
                <div className="text-sm text-gray-600">Avatar</div>
                <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files ? e.target.files[0] : null)} />
              </label>
              <label className="flex-1">
                <div className="text-sm text-gray-600">Cover photo</div>
                <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files ? e.target.files[0] : null)} />
              </label>
            </div>
            {error && <div className="text-red-600">{error}</div>}
            <div className="flex items-center gap-2">
              <button onClick={saveProfile} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving ? 'Saving...' : 'Save profile'}</button>
              <button onClick={() => setEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
