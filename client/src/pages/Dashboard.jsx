import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'

/* ── stat card definitions ─────────────────────────────────── */
const statConfig = [
  {
    key: 'total',
    label: 'Total',
    accent: '#6366f1',        // indigo
    accentBg: '#eef2ff',
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
  },
  {
    key: 'applied',
    label: 'Applied',
    accent: '#3b82f6',        // blue
    accentBg: '#eff6ff',
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
      </svg>
    ),
  },
  {
    key: 'interview',
    label: 'Interviewing',
    accent: '#f59e0b',        // amber
    accentBg: '#fffbeb',
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  },
  {
    key: 'rejected',
    label: 'Rejected',
    accent: '#ef4444',        // red
    accentBg: '#fef2f2',
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'offer',
    label: 'Offers',
    accent: '#10b981',        // emerald
    accentBg: '#ecfdf5',
    icon: (
      <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ── component ──────────────────────────────────────────────── */
export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [stats, setStats]   = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/api/applications/stats/dashboard'),
      api.get('/api/applications'),
    ])
      .then(([statsRes, appsRes]) => {
        setStats(statsRes.data)
        setRecent(appsRes.data.slice(0, 5))
      })
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false))
  }, [])

  const handle = user?.email?.split('@')[0] ?? 'there'

  return (
    <div>
      {/* ── page header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
            Welcome back, {handle}.
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Here is where your job hunt stands.</p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors duration-150 shrink-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Application
        </Link>
      </div>

      {/* ── stat cards ───────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl border border-slate-100 h-32 shadow-sm" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {statConfig.map(({ key, label, accent, accentBg, icon }) => (
            <div
              key={key}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              {/* icon badge */}
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: accentBg, color: accent }}
              >
                {icon}
              </div>
              {/* number + label */}
              <div>
                <p
                  className="text-[32px] font-bold leading-none tracking-tight"
                  style={{ color: '#0f172a' }}
                >
                  {stats?.[key] ?? 0}
                </p>
                <p className="text-xs text-slate-500 mt-1.5 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── recent activity ──────────────────────────────── */}
      <div className="mt-9">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-slate-900">Recent Activity</h2>
          <Link
            to="/applications"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
          >
            View all
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse h-14 rounded-xl bg-white border border-slate-100" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-10 text-center">
            <p className="text-sm text-slate-500">No applications yet.</p>
            <Link
              to="/applications/new"
              className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Add your first one
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
            {recent.map((app) => (
              <div
                key={app._id}
                onClick={() => navigate(`/applications/${app._id}`)}
                className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors duration-100 cursor-pointer group"
              >
                {/* company initial */}
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-indigo-600">
                    {app.company?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>
                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{app.company}</p>
                  <p className="text-xs text-slate-500 truncate">{app.role}</p>
                </div>
                {/* badge */}
                <StatusBadge status={app.status} />
                {/* date */}
                <span className="hidden sm:block text-xs text-slate-400 ml-1 shrink-0">
                  {formatDate(app.appliedDate)}
                </span>
                {/* arrow */}
                <svg
                  className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors duration-150 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
