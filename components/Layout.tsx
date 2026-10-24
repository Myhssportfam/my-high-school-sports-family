import React, { useEffect, useState } from "react"
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useAuth } from '../hooks/useAuth'
import {signOut} from '../lib/auth'


const navItems = [
  ['Home', '/'],
  ['States', '/states'],
  ['Athletes', '/athletes'],
  ['Live', '/live'],
  ['Arena', '/arena'],
  ['Recruiting', '/recruiting'],
  ['Coaches Corner', '/coaches'],
]

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {user, loading: authLoading} = useAuth()
  const { theme, setTheme } = useTheme()
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])
  return (
    <div className="min-h-screen bg-app">
      <Head>
        <title>My High School Sports Family</title>
        <meta name="description" content="Every athlete has a story, and this is where all athletes belong." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="site-shell flex min-h-16 items-center justify-between gap-2 py-2 sm:gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
  src="/mhssf-logo.png"
  alt="My High School Sports Family"
  className="h-10 w-10 shrink-0 rounded-full object-contain sm:h-16 sm:w-16"
/>
            <div className="min-w-0">
              <div className="hidden truncate text-sm font-black tracking-tight text-slate-950 dark:text-white sm:block sm:text-base">MY HIGH SCHOOL SPORTS FAMILY</div>
              <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 sm:block">One nation. Every athlete. One family.</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {mounted && (
  <button
    type="button"
    aria-label="Toggle color theme"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    className="icon-button hidden sm:inline-flex"
  >
    {theme === "dark" ? "☀️" : "🌙"}
  </button>
)}
            <details className="relative xl:hidden">
  <summary className="cursor-pointer list-none rounded-lg border px-3 py-2 font-bold">
    Menu
  </summary>
  <nav className="absolute right-0 top-full z-[60] mt-2 flex w-52 flex-col rounded-xl border bg-white p-2 shadow-xl dark:bg-slate-900">
    {!authLoading && !user && <Link href="/signin" className="mb-2 flex min-h-[44px] items-center rounded-lg bg-red-700 px-3 py-2 font-bold text-white hover:bg-red-800">Login</Link>}
    {navItems.map(([label, href]) => (
      <Link key={href} href={href} className="rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800">
        {label}
      </Link>
    ))}
  </nav>
</details>
            <UserMenu />
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-300 dark:border-slate-800">
        <div className="site-shell grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="brand-mark">M</div>
              <div className="font-black text-white">MY HIGH SCHOOL SPORTS FAMILY</div>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-400">Every athlete has a story, and this is where all athletes belong. Connecting sports families from youth leagues to high school, college, and beyond.</p>
          </div>
          <div>
            <div className="footer-title">Explore</div>
            <div className="footer-links">
              <Link href="/states">State Communities</Link>
              <Link href="/athletes">Athletes</Link>
              <Link href="/recruiting">Recruiting</Link>
              <Link href="/live">Live Sports</Link>
              <Link href="/arena">Video Game Arena</Link>
              <Link href="/coaches">Coaches Corner</Link>
            </div>
          </div>
          <div>
            <div className="footer-title">Company</div>
            <div className="footer-links">
              <Link href="/about">About</Link>
              <Link href="/contact">Contact</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">© {new Date().getFullYear()} My High School Sports Family. All rights reserved.</div>
      </footer>
    </div>
  )
}

function UserMenu() {
  const {user, loading} = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const authButton = 'inline-flex min-h-[44px] items-center justify-center rounded-lg bg-red-700 px-3 py-2 text-sm font-bold text-white hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:opacity-60'
  async function logout() {
    if (busy) return
    setBusy(true); setError('')
    try {await signOut()} catch {setError('Logout failed. Try again.')} finally {setBusy(false)}
  }
  if (loading) return <span className="px-3 text-sm" role="status">Loading…</span>
  return <div className="relative flex shrink-0 items-center gap-2">
    {user ? <>
      <Link href="/profile" className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-bold text-slate-900 dark:border-slate-600 dark:text-white">Profile</Link>
      <button type="button" className={authButton} disabled={busy} onClick={() => void logout()}>{busy ? 'Logging out…' : 'Logout'}</button>
    </> : <>
      <Link href="/signup" className="hidden rounded-lg border px-3 py-2 text-sm font-bold sm:inline-flex">Join Free</Link>
      <Link href="/signin" className={authButton}>Login</Link>
    </>}
    {error && <p role="alert" className="absolute right-0 top-full mt-2 w-52 rounded-lg bg-red-800 p-3 text-sm text-white">{error}</p>}
  </div>
}

export default Layout
