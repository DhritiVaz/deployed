import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const inputClass =
  'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

export default function Login() {
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'signin') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
    } else {
      const { error } = await signUp(email, password)
      if (error) {
        setError(error.message)
      } else {
        setMessage('Account created! Check your email to confirm, then sign in.')
        setMode('signin')
      }
    }

    setLoading(false)
  }

  const switchMode = (next) => {
    setMode(next)
    setError('')
    setMessage('')
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ background: '#f4f5f7' }}
    >
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="h-11 w-11 rounded-xl flex items-center justify-center mb-5 shadow-lg"
            style={{ background: '#0d1117' }}
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Deployed</h1>
          <p className="text-sm text-slate-500 mt-1.5">Track your applications, land your role.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Tab switcher */}
          <div className="flex border-b border-slate-100">
            <button
              type="button"
              onClick={() => switchMode('signin')}
              className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors duration-150 ${
                mode === 'signin'
                  ? 'text-slate-900 bg-white border-b-2 border-indigo-600'
                  : 'text-slate-400 hover:text-slate-600 bg-slate-50/60'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors duration-150 ${
                mode === 'signup'
                  ? 'text-slate-900 bg-white border-b-2 border-indigo-600'
                  : 'text-slate-400 hover:text-slate-600 bg-slate-50/60'
              }`}
            >
              Create account
            </button>
          </div>

          <div className="p-7">
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
                <svg className="h-4 w-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {message && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                <svg className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-emerald-700">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                  Email address
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  required
                  autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'signup' ? 'At least 6 characters' : ''}
                  className={inputClass}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-150 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Please wait...'
                  : mode === 'signin'
                  ? 'Sign in'
                  : 'Create account'}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Your job hunt, organized.
        </p>
      </div>
    </div>
  )
}
