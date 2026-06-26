const config = {
  applied: {
    dot: 'bg-blue-500',
    pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  },
  interview: {
    dot: 'bg-amber-500',
    pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  rejected: {
    dot: 'bg-red-500',
    pill: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  },
  offer: {
    dot: 'bg-emerald-500',
    pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
}

const fallback = {
  dot: 'bg-slate-400',
  pill: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
}

export default function StatusBadge({ status }) {
  const c = config[status] ?? fallback
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${c.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />
      {label}
    </span>
  )
}
