import React from 'react'

// one row per resume file (names should match what you save in "Applied Resume Name")
const SAMPLE = [
  { name: 'Resume_FullStack_v3.pdf', applied: 8, interviews: 3 },
  { name: 'Resume_Java_v2.pdf',      applied: 6, interviews: 1 },
  { name: 'Resume_ReactLead_v1.pdf', applied: 3, interviews: 1 },
  { name: 'Resume_General_v1.pdf',   applied: 1, interviews: 0 },
]

const rateOf = (r) => (r.applied ? (r.interviews / r.applied) * 100 : 0)

const ResumePerformance = ({ resumes = SAMPLE, onCompare }) => {
  const rows = resumes
    .map((r) => ({ ...r, rate: rateOf(r) }))
    .sort((a, b) => b.rate - a.rate || b.applied - a.applied)

  const best = rows[0]

  // compare the best resume with all the other resumes combined
  const others = rows.slice(1)
  const othersApplied = others.reduce((s, r) => s + r.applied, 0)
  const othersInterviews = others.reduce((s, r) => s + r.interviews, 0)
  const othersRate = othersApplied ? (othersInterviews / othersApplied) * 100 : 0
  const multiple = othersRate > 0 && best ? best.rate / othersRate : 0
  const multipleText = Number.isInteger(Math.round(multiple * 10) / 10)
    ? Math.round(multiple)
    : (Math.round(multiple * 10) / 10)

  return (
    <div className='flex h-full flex-col gap-4'>
      {/* header */}
      <div className='flex items-start justify-between gap-3'>
        <p className='flex flex-col'>
          <span className='text-[11px] font-semibold uppercase tracking-wide text-neutral-500'>
            A/B narrative efficacy
          </span>
          <span className='text-lg font-bold text-gray-900'>Resume Performance</span>
        </p>

        <button
          type='button'
          onClick={onCompare}
          className='flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200 cursor-pointer'
        >
          <span className='material-symbols-outlined text-[18px]'>compare_arrows</span>
          Compare Tags
        </button>
      </div>

      <p className='text-sm text-neutral-500'>
        Evaluation of profile variants against initial screening response rates.
      </p>

      {/* table */}
      <div className='overflow-x-auto'>
        <table className='w-full min-w-100 text-left text-sm'>
          <thead>
            <tr className='border-y border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600'>
              <th className='px-3 py-2.5 font-semibold'>Resume Document</th>
              <th className='px-3 py-2.5 text-right font-semibold'>Applied</th>
              <th className='px-3 py-2.5 text-right font-semibold'>Interviews</th>
              <th className='px-3 py-2.5 text-right font-semibold'>Callback Rate</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => {
              const top = i === 0 && r.rate > 0
              return (
                <tr key={r.name} className='border-b border-gray-100 last:border-0'>
                  <td className='px-3 py-3'>
                    <span className='flex items-center gap-2'>
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          top ? 'text-emerald-600' : 'text-gray-400'
                        }`}
                      >
                        description
                      </span>
                      <span className={`truncate ${top ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {r.name}
                      </span>
                    </span>
                  </td>
                  <td className='px-3 py-3 text-right text-gray-700'>{r.applied}</td>
                  <td className='px-3 py-3 text-right text-gray-700'>{r.interviews}</td>
                  <td className='px-3 py-3 text-right'>
                    <span className='inline-flex items-center justify-end gap-2'>
                      <span className={top ? 'font-semibold text-emerald-700' : 'text-gray-700'}>
                        {r.rate.toFixed(1)}%
                      </span>
                      {top && (
                        <span className='rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800'>
                          Top
                        </span>
                      )}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* takeaway */}
      {best && best.rate > 0 && (
        <div className='mt-auto flex items-start gap-2 rounded-xl bg-sky-50 px-3 py-2.5 text-xs text-sky-900'>
          <span className='material-symbols-outlined shrink-0 text-[18px] text-sky-600'>
            lightbulb
          </span>
          <p>
            <b>Strategic Takeaway</b>
            <br />
            {multiple >= 1.2
              ? <><b>{best.name.replace('.pdf', '')}</b> delivers about {multipleText}x the callback rate of your other resumes. Consider using it as your default for upcoming applications.</>
              : <><b>{best.name.replace('.pdf', '')}</b> is leading at {best.rate.toFixed(1)}%, but the gap is small. Keep testing before you pick a default.</>}
          </p>
        </div>
      )}
    </div>
  )
}

export default ResumePerformance