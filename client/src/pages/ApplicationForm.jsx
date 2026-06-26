import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const STATUS_OPTIONS = ['applied', 'interview', 'rejected', 'offer']

const statusMeta = {
  applied:   { dot: 'bg-blue-500',    label: 'Applied'     },
  interview: { dot: 'bg-amber-500',   label: 'Interviewing' },
  rejected:  { dot: 'bg-red-500',     label: 'Rejected'    },
  offer:     { dot: 'bg-emerald-500', label: 'Offer'       },
}

/* shared input / label class strings */
const input =
  'block w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-colors duration-150 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'

const label = 'block text-xs font-semibold tracking-wide text-slate-500 mb-1.5'

function toDateInput(d) {
  if (!d) return ''
  try { return new Date(d).toISOString().split('T')[0] } catch { return '' }
}

/* ── card wrapper ─────────────────────────────────────────── */
function Card({ title, badge, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {badge && (
          <span className="text-[11px] font-medium text-slate-400">{badge}</span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

/* ── component ────────────────────────────────────────────── */
export default function ApplicationForm({ initialData = {}, onSubmit, isSubmitting, title }) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    company:     initialData.company     ?? '',
    role:        initialData.role        ?? '',
    platform:    initialData.platform    ?? '',
    jobLink:     initialData.jobLink     ?? '',
    appliedDate: toDateInput(initialData.appliedDate) || new Date().toISOString().split('T')[0],
    status:      initialData.status      ?? 'applied',
    notes: {
      interviewerName: initialData.notes?.interviewerName ?? '',
      feedback:        initialData.notes?.feedback        ?? '',
      followUpDate:    toDateInput(initialData.notes?.followUpDate),
      contactEmail:    initialData.notes?.contactEmail    ?? '',
      extra:           initialData.notes?.extra           ?? '',
    },
    resume: initialData.resume ?? { fileName: '', fileUrl: '' },
  })

  const [resumeFile,  setResumeFile]  = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [uploading,   setUploading]   = useState(false)

  const set     = (f, v) => setForm((p) => ({ ...p, [f]: v }))
  const setNote = (f, v) => setForm((p) => ({ ...p, notes: { ...p.notes, [f]: v } }))

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setResumeError('')
    if (!file) return
    if (file.type !== 'application/pdf') {
      setResumeError('Only PDF files are accepted.')
      e.target.value = ''
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File must be under 5 MB.')
      e.target.value = ''
      return
    }
    setResumeFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setResumeError('')
    let resumeData = form.resume

    if (resumeFile) {
      setUploading(true)
      try {
        const fd = new FormData()
        fd.append('resume', resumeFile)
        const { data } = await api.post('/api/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        resumeData = { fileName: data.fileName, fileUrl: data.fileUrl }
      } catch {
        setResumeError('Resume upload failed. Please try again.')
        setUploading(false)
        return
      }
      setUploading(false)
    }

    onSubmit({ ...form, resume: resumeData })
  }

  return (
    <div>
      {/* page header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="h-8 w-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-all duration-150 shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">{title}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ── two-column layout ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-5 items-start">

          {/* LEFT column */}
          <div className="space-y-5">

            {/* Basic info */}
            <Card title="Application Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={label}>
                    Company <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => set('company', e.target.value)}
                    placeholder="Google, Stripe, Notion..."
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>
                    Role <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                    placeholder="Software Engineer Intern"
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Platform</label>
                  <input
                    type="text"
                    value={form.platform}
                    onChange={(e) => set('platform', e.target.value)}
                    placeholder="LinkedIn, Handshake, Company site..."
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Job Link</label>
                  <input
                    type="url"
                    value={form.jobLink}
                    onChange={(e) => set('jobLink', e.target.value)}
                    placeholder="https://..."
                    className={input}
                  />
                </div>
              </div>
            </Card>

            {/* Notes */}
            <Card title="Notes" badge="Optional">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={label}>Interviewer Name</label>
                  <input
                    type="text"
                    value={form.notes.interviewerName}
                    onChange={(e) => setNote('interviewerName', e.target.value)}
                    placeholder="Jane Smith"
                    className={input}
                  />
                </div>
                <div>
                  <label className={label}>Contact Email</label>
                  <input
                    type="email"
                    value={form.notes.contactEmail}
                    onChange={(e) => setNote('contactEmail', e.target.value)}
                    placeholder="jane@company.com"
                    className={input}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Follow-up Date</label>
                  <input
                    type="date"
                    value={form.notes.followUpDate}
                    onChange={(e) => setNote('followUpDate', e.target.value)}
                    className={input + ' max-w-[200px]'}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Feedback</label>
                  <textarea
                    rows={3}
                    value={form.notes.feedback}
                    onChange={(e) => setNote('feedback', e.target.value)}
                    placeholder="Interview notes, impressions, feedback received..."
                    className={input + ' resize-none leading-relaxed'}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className={label}>Extra Notes</label>
                  <textarea
                    rows={3}
                    value={form.notes.extra}
                    onChange={(e) => setNote('extra', e.target.value)}
                    placeholder="Anything else worth remembering..."
                    className={input + ' resize-none leading-relaxed'}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* RIGHT column */}
          <div className="space-y-5">

            {/* Status & date */}
            <Card title="Status">
              <div className="space-y-5">
                {/* status selector */}
                <div>
                  <label className={label}>Current Status</label>
                  <div className="grid grid-cols-2 gap-2 mt-0.5">
                    {STATUS_OPTIONS.map((s) => {
                      const m = statusMeta[s]
                      const active = form.status === s
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => set('status', s)}
                          className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium border transition-all duration-150 ${
                            active
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`h-2 w-2 rounded-full shrink-0 ${m.dot}`} />
                          {m.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* date */}
                <div>
                  <label className={label}>Applied Date</label>
                  <input
                    type="date"
                    value={form.appliedDate}
                    onChange={(e) => set('appliedDate', e.target.value)}
                    className={input}
                  />
                </div>
              </div>
            </Card>

            {/* Resume */}
            <Card title="Resume">
              {/* existing file banner */}
              {form.resume.fileName && !resumeFile && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-700 truncate">{form.resume.fileName}</p>
                    <p className="text-[11px] text-slate-400">Current file</p>
                  </div>
                  {form.resume.fileUrl && (
                    <a
                      href={form.resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-500 shrink-0 transition-colors"
                    >
                      View
                    </a>
                  )}
                </div>
              )}

              {/* drop zone */}
              <label className="relative group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/60 px-5 py-8 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/40 transition-all duration-200">
                {resumeFile ? (
                  <>
                    {/* selected file state */}
                    <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{resumeFile.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {(resumeFile.size / 1024 / 1024).toFixed(2)} MB — click to change
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* idle state */}
                    <div className="h-10 w-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors duration-200">
                      <svg className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {form.resume.fileName ? 'Replace resume' : 'Upload resume'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">PDF only, max 5 MB</p>
                    </div>
                  </>
                )}
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>

              {resumeError && (
                <p className="mt-2.5 text-xs text-red-600 flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                  </svg>
                  {resumeError}
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* ── actions bar ───────────────────────────────── */}
        <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {uploading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Uploading resume...
              </>
            ) : isSubmitting ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </>
            ) : (
              'Save Application'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-150"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
