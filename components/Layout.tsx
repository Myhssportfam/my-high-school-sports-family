import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useAuth } from '../hooks/useAuth'

const navItems = [
  ['Home', '/'],
  ['States', '/states'],
  ['Athletes', '/athletes'],
  ['Live', '/live'],
  ['Arena', '/arena'],
  ['Recruiting', '/recruiting'],
]

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-app">
      <Head>
        <title>My High School Sports Family</title>
        <meta name="description" content="Every athlete has a story, and this is where all athletes belong." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90">
        <div className="site-shell flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="brand-mark">M</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-black tracking-tight text-slate-950 dark:text-white sm:text-base">MY HIGH SCHOOL SPORTS FAMILY</div>
              <div className="hidden text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 sm:block">One nation. Every athlete. One family.</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="nav-link">{label}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              aria-label="Toggle color theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="icon-button"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
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
  const { user } = useAuth()
  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/signin" className="hidden rounded-full px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:block">Sign in</Link>
        <Link href="/signup" className="primary-button compact">Join Free</Link>
      </div>
    )
  }

  return (
    <Link href="/profile" className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 pr-3 text-sm font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <img src={user.photoURL || '/default-avatar.png'} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
      <span className="hidden sm:inline">Profile</span>
    </Link>
  )
}

export default Layout
