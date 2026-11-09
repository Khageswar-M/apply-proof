import React from 'react'

// order = order shown in the bar and list
const STAGES = [
  { key: 'APPLIED',        label: 'Applied',        color: '#4a78a8' },
  { key: 'SHORTLISTED',    label: 'Shortlisted',    color: '#c9a23c' },
  { key: 'INTERVIEW_CALL', label: 'Interview Call', color: '#8b6fb5' },
  { key: 'INTERVIEWED',    label: 'Interviewed',    color: '#3b8f9a' },
  { key: 'FINAL_ROUND',    label: 'Final Round',    color: '#5b6fc0' },
  { key: 'OFFER',          label: 'Offer',          color: '#3f9b6e' },
  { key: 'REJECTED',       label: 'Rejected',       color: '#c05a5a' },
]

// stages that count as "late rounds or offers"
const LATE_STAGES = ['INTERVIEWED', 'FINAL_ROUND', 'OFFER']

// counts = { APPLIED: 8, SHORTLISTED: 4, ... } (same keys as your backend enum)
const StatusBreakDown = ({
  counts = { APPLIED: 8, SHORTLISTED: 4, INTERVIEW_CALL: 3, INTERVIEWED: 2, OFFER: 1, REJECTED: 1 },
}) => {
  const total = STAGES.reduce((sum, s) => sum + (counts[s.key] || 0), 0)
  const rows = STAGES
    .map((s) => ({ ...s, count: counts[s.key] || 0 }))
    .filter((s) => s.count > 0)

  const late = LATE_STAGES.reduce((sum, k) => sum + (counts[k] || 0), 0)
  const progress = total ? Math.round((late / total) * 100) : 0
  const pct = (n) => (total ? Math.round((n / total) * 100) : 0)

  return (
    <div className='flex h-full flex-col gap-4'>
      {/* header */}
      <div className='flex items-start justify-between gap-3'>
        <p className='flex flex-col'>
          <span className='text-[11px] font-semibold uppercase tracking-wide text-neutral-500'>
            Funnel conversion
          </span>
          <span className='text-lg font-bold text-gray-900'>Status Breakdown</span>
        </p>
        <span className='shrink-0 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700'>
          {total} Total Applications
        </span>
      </div>

      <p className='text-sm text-neutral-500'>
        Pipeline health reflecting your tailored applications versus current outcomes.
      </p>

      {/* stacked bar */}
      <div
        className='flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-gray-100'
        role='img'
        aria-label='Applications by status'
      >
        {rows.map((s) => (
          <div
            key={s.key}
            title={`${s.label}: ${s.count}`}
            style={{ width: `${(s.count / total) * 100}%`, background: s.color }}
          />
        ))}
      </div>

      {/* legend rows */}
      <ul className='flex flex-col gap-2.5'>
        {rows.map((s) => (
          <li key={s.key} className='flex items-center gap-3 text-sm'>
            <span className='h-2.5 w-2.5 shrink-0 rounded-full' style={{ background: s.color }} />
            <span className='flex-1 text-gray-800'>{s.label}</span>
            <span className='text-xs text-neutral-500'>
              {s.count} {s.count === 1 ? 'lead' : 'leads'}
            </span>
            <span className='w-10 text-right text-sm font-semibold text-gray-900'>{pct(s.count)}%</span>
          </li>
        ))}
      </ul>

      {/* footer note */}
      <div className='mt-auto flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900'>
        <span className='material-symbols-outlined shrink-0 text-[18px] text-emerald-600'>
          check_circle
        </span>
        <p>
          <b>{progress}% Progress Rate:</b> {late} of {total} tracked roles have reached late rounds or offers.
        </p>
      </div>
    </div>
  )
}

export default StatusBreakDown