import React, { useEffect, useMemo, useRef } from 'react'
import HeatMap from '@uiw/react-heat-map'

const RECT = 12
const SPACE = 3

// light -> dark green. Key = minimum applications in a day for that color
const LEVELS = {
    0: '#f3f4f6', // none
    1: '#a7f3d0',
    2: '#34d399',
    3: '#059669',
    4: '#065f46',
}

/* ---------- helpers (local time, not UTC) ---------- */
const pad = (n) => String(n).padStart(2, '0')
const fmt = (d) => `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}`

// [{ appliedAt: '2026-11-09T10:30:00Z' }, ...] -> [{ date: '2026/11/09', count: 2 }, ...]
export const toHeatmapData = (applications = []) => {
    const perDay = {}
    applications.forEach((a) => {
        const key = fmt(new Date(a.appliedAt))
        perDay[key] = (perDay[key] || 0) + 1
    })
    return Object.entries(perDay).map(([date, count]) => ({ date, count }))
}

const Stats = ({ applications = [] }) => {
    const scrollRef = useRef(null)

    // last cell = today, first cell = exactly 365 days ago
    const { startDate, endDate } = useMemo(() => {
        const now = new Date()
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 365)
        return { startDate: start, endDate: end }
    }, [])

    const data = useMemo(() => toHeatmapData(applications), [applications])

    // 366 days + blank cells before the first Sunday-aligned column
    const weeks = Math.ceil((366 + startDate.getDay()) / 7)
    const width = weeks * (RECT + SPACE) + 34

    // on small screens, show the latest weeks first
    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [])

    return (
        <div className='flex flex-col gap-4 rounded-md bg-white p-5 shadow'>
            <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-800'>Streak &amp; Consistency</span>
                <span className='text-xs text-neutral-500'>
                    {applications.length} application{applications.length === 1 ? '' : 's'} in the last year
                </span>
            </div>

            <div className='flex flex-col'>
                <div ref={scrollRef} className='overflow-x-auto pb-1'>
                    <HeatMap
                        value={data}
                        startDate={startDate}
                        endDate={endDate}
                        width={width}
                        rectSize={RECT}
                        space={SPACE}
                        legendCellSize={0}
                        weekLabels={['', 'Mon', '', 'Wed', '', 'Fri', '']}
                        panelColors={LEVELS}
                        rectProps={{ rx: 2 }}
                        style={{ color: '#6b7280' }}
                        rectRender={(props, cell) => (
                            <rect {...props}>
                                <title>
                                    {`${cell.count || 0} application${cell.count === 1 ? '' : 's'} on ${cell.date}`}
                                </title>
                            </rect>
                        )}
                    />
                </div>

                {/* legend */}
                <div className='flex items-center justify-end gap-1.5 text-xs text-gray-500'>
                    <span>Less</span>
                    {Object.values(LEVELS).map((color) => (
                        <span
                            key={color}
                            className='h-3 w-3'
                            style={{ background: color, borderRadius: 3 }}
                        />
                    ))}
                    <span>More</span>
                </div>
            </div>
        </div>
    )
}

export default Stats