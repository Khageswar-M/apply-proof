import React, { useEffect, useMemo, useRef, useState } from 'react'
import HeatMap from '@uiw/react-heat-map'
import analyticsService from '../../../../../../services/analyticsService'

const DEFAULT_USER_ID = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30'

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

// [{ date: '2026-11-10', count: 8 }, ...] -> [{ date: '2026/11/10', count: 8 }, ...]
// keeps only days inside the heatmap range so the total matches what's drawn
export const toHeatmapData = (stats = [], startKey = '', endKey = '9999/99/99') =>
    stats
        .map(({ date, count }) => ({ date: String(date).slice(0, 10).replace(/-/g, '/'), count }))
        .filter((d) => d.count > 0 && d.date >= startKey && d.date <= endKey)

const Stats = ({ userId = DEFAULT_USER_ID }) => {
    const scrollRef = useRef(null)
    const [stats, setStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let cancelled = false

        const load = async () => {
            setLoading(true)
            setError('')
            try {
                const res = await analyticsService.getApplicationStatsByUserId(userId)
                // works whether responseGateway returns the axios response or the body
                const body = res?.data
                const list = (Array.isArray(body) ? body : body?.data) || []
                if (!cancelled) setStats(list)
            } catch (err) {
                if (!cancelled) setError(err?.response?.data?.message || 'Failed to load stats.')
            } finally {
                if (!cancelled) setLoading(false)
            }
        }

        load()
        return () => {
            cancelled = true
        }
    }, [userId])

    // last cell = today, first cell = exactly 365 days ago
    const { startDate, endDate } = useMemo(() => {
        const now = new Date()
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 365)
        return { startDate: start, endDate: end }
    }, [])

    const data = useMemo(
        () => toHeatmapData(stats, fmt(startDate), fmt(endDate)),
        [stats, startDate, endDate]
    )

    const total = useMemo(() => data.reduce((sum, d) => sum + d.count, 0), [data])

    // 366 days + blank cells before the first Sunday-aligned column
    const weeks = Math.ceil((366 + startDate.getDay()) / 7)
    const width = weeks * (RECT + SPACE) + 34

    // on small screens, show the latest weeks first.
    // Runs after loading finishes, because the heatmap isn't mounted before that.
    useEffect(() => {
        const el = scrollRef.current
        if (el) el.scrollLeft = el.scrollWidth
    }, [loading])

    return (
        <div className='flex flex-col gap-4 rounded-md bg-white p-5 shadow'>
            <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-800'>Streak &amp; Consistency</span>
                <span className='text-xs text-neutral-500'>
                    {loading
                        ? 'Loading...'
                        : `${total} application${total === 1 ? '' : 's'} in the last year`}
                </span>
            </div>

            {loading ? (
                <div className='flex h-28 items-center justify-center text-xs text-neutral-500'>
                    Loading stats...
                </div>
            ) : error ? (
                <div className='flex h-28 items-center justify-center text-xs text-red-600'>
                    {error}
                </div>
            ) : (
                <div className='flex flex-col items-center'>
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
            )}
        </div>
    )
}

export default Stats