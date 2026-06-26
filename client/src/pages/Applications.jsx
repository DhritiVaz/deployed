import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import StatusBadge from '../components/StatusBadge'

const STATUSES = ['all', 'applied', 'interview', 'rejected', 'offer']

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc',  label: 'Oldest first' },
  { value: 'company-asc',  label: 'Company A–Z' },
  { value: 'company-desc', label: 'Company Z–A' },
]

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* colour for the company initial avatar */
const avatarPalette = [
  ['#eef2ff', '#4f46e5'], // indigo
  ['#eff6ff', '#2563eb'], // blue
  ['#f0fdf4', '#16a34a'], // green
  ['#fffbeb', '#d97706'], // amber
  ['#fdf2f8', '#9333ea'], // purple
  ['#fff1f2', '#e11d48'], // rose
]
function avatarStyle(name) {
  const idx = (name?.charCodeAt(0) ?? 0) % avatarPalette.length
  const [bg, color] = avatarPalette[idx]
  return { background: bg, color }
}

export default function Applications() {
  const [applications, setApplications] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sort,     setSort]     = useState('date-desc')
  const [deleting, setDeleting] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/applications')
      .then(({ data }) => setApplications(data))
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this application? This cannot be undone.')) return
    setDeleting(id)
    try {
      await api.delete(`/api/applications/${id}`)
      setApplications((prev) => prev.filter((a) => a._id !== id))
    } catch {
      alert('Failed to delete application.')
    } finally {
      setDeleting(null)
    }
  }

  const filtered = applications
    .filter((a) => statusFilter === 'all' || a.status === statusFilter)
    .sort((a, b) => {
      if (sort === 'date-desc')    return new Date(b.appliedDate) - new Date(a.appliedDate)
      if (sort === 'date-asc')     return new Date(a.appliedDate) - new Date(b.appliedDate)
      if (sort === 'company-asc')  return a.company.localeCompare(b.company)
      if (sort === 'company-desc') return b.company.localeCompare(a.company)
      return 0
    })

  return (
    <div>
      {/* ── header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Applications</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {applications.length} application{applications.length !== 1 ? 's' : ''} tracked
          </p>
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

      {/* ── filters + sort ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        {/* status pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-all duration-150 ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-800'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
        {/* sort */}
        <div className="sm:ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── content ──────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse h-[68px] rounded-2xl bg-white border border-slate-100" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm py-16 px-6 text-center">
          <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-700">
            {statusFilter !== 'all' ? `No ${statusFilter} applications` : 'No applications yet'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {statusFilter !== 'all' ? 'Try a different filter.' : 'Start tracking your job hunt.'}
          </p>
          {statusFilter === 'all' && (
            <Link
              to="/applications/new"
              className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors duration-150"
            >
              Add first application
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {/* table header */}
          <div className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto_auto_auto] lg:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-3 border-b border-slate-50">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Company</span>
            <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">Status</span>
            <span className="hidden md:block text-[11px] font-semibold uppercase tracking-widest text-slate-400">Applied</span>
            <span className="hidden lg:block text-[11px] font-semibold uppercase tracking-widest text-slate-400">Platform</span>
            <span className="hidden sm:block w-14" />
          </div>

          {/* rows */}
          <div className="divide-y divide-slate-50">
            {filtered.map((app) => (
              <div
                key={app._id}
                onClick={() => navigate(`/applications/${app._id}`)}
                className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_auto_auto_auto] lg:grid-cols-[1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-slate-50/80 cursor-pointer transition-colors duration-100 group"
              >
                {/* company + role */}
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold"
                    style={avatarStyle(app.company)}
                  >
                    {app.company?.[0]?.toUpperCase() ?? '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{app.company}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{app.role}</p>
                  </div>
                </div>

                {/* status */}
                <div>
                  <StatusBadge status={app.status} />
                </div>

                {/* date */}
                <div className="hidden md:block text-xs text-slate-500 tabular-nums">
                  {formatDate(app.appliedDate)}
                </div>

                {/* platform */}
                <div className="hidden lg:block text-xs text-slate-500 truncate max-w-[120px]">
                  {app.platform || '—'}
                </div>

                {/* actions */}
                <div
                  className="hidden sm:flex items-center justify-end gap-1.5 w-14"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/applications/${app._id}/edit`}
                    title="Edit"
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-150"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDelete(app._id)}
                    disabled={deleting === app._id}
                    title="Delete"
                    className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-all duration-150"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
