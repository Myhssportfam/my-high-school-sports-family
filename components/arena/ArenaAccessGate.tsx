import Link from 'next/link'
import { ReactNode } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useUserProfile } from '../../hooks/useUserProfile'

type ArenaAccessGateProps = {
  children: ReactNode
}

export default function ArenaAccessGate({
  children,
}: ArenaAccessGateProps) {
  const { user, loading: authLoading } = useAuth()
  const {
  profile,
  loading: profileLoading,
} = useUserProfile(user?.uid)
console.log("ARENA ACCESS STATUS:", {
  authLoading,
  profileLoading,
  userId: user?.uid ?? "no user",
  hasProfile: Boolean(profile),
})
  if (authLoading || profileLoading) {
    return (
      <div className="grid min-h-[500px] place-items-center bg-slate-950 text-white">
        <p className="font-bold">Loading Arena...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="grid min-h-[500px] place-items-center bg-slate-950 px-4 text-white">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-black">Join the Arena</h1>

          <p className="mt-3 text-slate-300">
            Create an account or sign in before joining Arena rooms.
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/signup?next=/profile"
              className="rounded-xl bg-red-600 px-6 py-3 font-black hover:bg-red-700"
            >
              Create Account
            </Link>

            <Link
              href="/signin?next=/arena"
              className="rounded-xl border border-white/20 px-6 py-3 font-black hover:bg-white/10"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!profile?.displayName || !profile?.role) {
    return (
      <div className="grid min-h-[500px] place-items-center bg-slate-950 px-4 text-white">
        <div className="max-w-lg rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
          <h1 className="text-3xl font-black">Create Your Profile</h1>

          <p className="mt-3 text-slate-300">
            Choose whether you are an athlete, coach, cheerleader, band
            member, fan, parent, trainer, or media member.
          </p>

          <Link
            href="/profile?next=/arena"
            className="mt-6 inline-block rounded-xl bg-red-600 px-6 py-3 font-black hover:bg-red-700"
          >
            Create Profile
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}