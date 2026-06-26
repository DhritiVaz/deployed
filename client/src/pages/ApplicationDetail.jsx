import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api'
import StatusBadge from '../components/StatusBadge'

function InfoField({ label, children }) {
  if (!children) return null
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{label}</dt>
      <dd className="text-sm text-slate-800">{children}</dd>
    </div>
  )
}

function formatDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

const statusAccent = {
  applied:   { bar: '#3b82f6', bg: '#eff6ff' },
  interview: { bar: '#f59e0b', bg: '#fffbeb' },
  rejected:  { bar: '#ef4444', bg: '#fef2f2' },
  offer:     { bar: '#10b981', bg: '#ecfdf5' },
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [application, setApplication] = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    api.get(`/api/applications/${id}`)
      .then(({ data }) => setApplication(data))
      .catch(() => setError('Failed to load application.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleDelete = async () => {
    if (!confirm('Delete this application? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.delete(`/api/applications/${id}`)
      navigate('/applications')
    } catch {
      alert('Failed to delete application.')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
    )
  }

  const { company, role, status, platform, jobLink, appliedDate, resume, notes } = application
  const accent = statusAccent[status] ?? { bar: '#6366f1', bg: '#eef2ff' }
  const hasNotes = Object.values(notes ?? {}).some(Boolean)

  return (
    <div className="max-w-2xl">
      {/* back */}
      <Link
        to="/applications"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors duration-150 group"
      >
        <svg className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        All Applications
      </Link>

      {/* ── hero card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4">
        {/* status colour bar */}
        <div className="h-1.5 w-full" style={{ background: accent.bar }} />

        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* company initial */}
              <div
                className="h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: accent.bg, color: accent.bar }}
              >
                {company?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">{company}</h1>
                <p className="text-sm text-slate-500 mt-0.5">{role}</p>
              </div>
            </div>
            <StatusBadge status={status} />
          </div>

          {/* key info */}
          <dl className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 border-t border-slate-50 pt-5">
            <InfoField label="Applied Date">{formatDate(appliedDate)}</InfoField>
            <InfoField label="Platform">{platform}</InfoField>
            <InfoField label="Job Posting">
              {jobLink ? (
                <a
                  href={jobLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2 transition-colors duration-150"
                >
                  View posting
                </a>
              ) : null}
            </InfoField>
          </dl>
        </div>
      </div>

      {/* ── resume card ──────────────────────────────────── */}
      {resume?.fileName && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-4">Resume</h2>
          <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5">
            {/* pdf icon */}
            <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
              <svg className="h-4.5 w-4.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{resume.fileName}</p>
              <p className="text-xs text-slate-400 mt-0.5">PDF document</p>
            </div>
            {resume.fileUrl && (
              <a
                href={resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-700 transition-colors duration-150 shrink-0"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </a>
            )}
          </div>
        </div>
      )}

      {/* ── notes card ───────────────────────────────────── */}
      {hasNotes && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-5">Notes</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <InfoField label="Interviewer Name">{notes.interviewerName}</InfoField>
            <InfoField label="Contact Email">
              {notes.contactEmail ? (
                <a
                  href={`mailto:${notes.contactEmail}`}
                  className="text-indigo-600 hover:text-indigo-500 underline underline-offset-2 transition-colors duration-150"
                >
                  {notes.contactEmail}
                </a>
              ) : null}
            </InfoField>
            <InfoField label="Follow-up Date">{formatDate(notes.followUpDate)}</InfoField>
            {notes.feedback && (
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Feedback</dt>
                <dd className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{notes.feedback}</dd>
              </div>
            )}
            {notes.extra && (
              <div className="sm:col-span-2">
                <dt className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">Extra Notes</dt>
                <dd className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{notes.extra}</dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* ── actions ──────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-1">
        <Link
          to={`/applications/${id}/edit`}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
          Edit Application
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm hover:bg-red-50 hover:border-red-200 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  )
}
