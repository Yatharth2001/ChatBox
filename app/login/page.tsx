'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Use NextAuth redirect flow to ensure session is established by the auth provider
      await signIn('credentials', {
        email,
        password,
        callbackUrl: '/chat',
      })
    } catch {
      setError('Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true)
    setError('')
    try {
      const result = await signIn(provider, { callbackUrl: '/chat', redirect: false })
      if (result?.error) setError(`OAuth login failed: ${result.error}`)
      else if (result?.url) window.location.href = result.url
    } catch (err) {
      setError(`OAuth login failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl ring-1 ring-white/10 p-8 dark:bg-white/5">
          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/10 ring-1 ring-sky-400/30">
              <span className="text-lg font-bold text-sky-400">CB</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Login to ChatBox</h1>
            <p className="text-sm text-slate-400">Welcome back! Please enter your details.</p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              role="alert"
            >
              {error}
            </div>
          )}

       

          {/* Divider */}
          {process.env.NEXT_PUBLIC_FALLBACK_AUTH_ENABLED === 'true' && (
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs text-slate-400">or</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>
          )}

          {/* Credentials form (fallback) */}
          {process.env.NEXT_PUBLIC_FALLBACK_AUTH_ENABLED === 'true' && (
            <form onSubmit={handleCredentialsLogin} className="space-y-4" noValidate>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-200">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="yatharth@gmail.com or manasvi@gmail.com"
                  className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-slate-100 placeholder:text-slate-400 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-200">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="password"
                  className="w-full rounded-xl bg-white/[0.04] px-4 py-3 text-slate-100 placeholder:text-slate-400 border border-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group relative inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isLoading && (
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-30" />
                    <path d="M22 12a10 10 0 0 1-10 10" fill="currentColor" />
                  </svg>
                )}
                {isLoading ? 'Logging in…' : 'Login'}
              </button>
            </form>
          )}

          {/* Demo accounts */}
          <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4 text-xs text-slate-300">
            <p className="mb-2 font-medium text-slate-200">Demo users</p>
            <ul className="space-y-1">
              <li><span className="font-semibold">yatharth</span>: yatharth@gmail.com / password</li>
              <li><span className="font-semibold">manasvi</span>: manasvi@gmail.com / password</li>
            </ul>
          </div>

          {/* Secondary links */}
          <div className="mt-6 text-center text-sm text-slate-400">
            Don’t have an account?{' '}
            <a href="/register" className="font-medium text-sky-400 hover:underline">
              Create account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
