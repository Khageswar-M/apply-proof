import React, { useEffect, useMemo, useState } from 'react';
import analyticsService from '../../../../../../services/analyticsService';

const DEFAULT_USER_ID = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30';

/* ---------- date helpers (local time, not UTC) ---------- */
const pad = (n) => String(n).padStart(2, '0');
const toDayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// "2026-11-10" -> day number, so consecutive days differ by exactly 1 (DST-safe)
const dayNumber = (key) => {
    const [y, m, d] = key.split('-').map(Number);
    return Math.round(Date.UTC(y, m - 1, d) / 86400000);
};

// A day counts toward the streak if you applied at least once
const calcStreaks = (countByDay) => {
    const today = new Date();
    const todayKey = toDayKey(today);
    const applicationsToday = countByDay[todayKey] || 0;

    // Current streak: walk back from today. If nothing today yet, start from
    // yesterday so the streak stays alive until the day ends.
    const cursor = new Date(today);
    if (!applicationsToday) cursor.setDate(cursor.getDate() - 1);

    let streakDays = 0;
    while ((countByDay[toDayKey(cursor)] || 0) > 0) {
        streakDays++;
        cursor.setDate(cursor.getDate() - 1);
    }

    // Best streak: longest run of consecutive active days in the whole history
    const activeDays = Object.keys(countByDay)
        .filter((k) => countByDay[k] > 0)
        .map(dayNumber)
        .sort((a, b) => a - b);

    let bestStreak = 0;
    let run = 0;
    activeDays.forEach((n, i) => {
        run = i > 0 && n - activeDays[i - 1] === 1 ? run + 1 : 1;
        bestStreak = Math.max(bestStreak, run);
    });

    return { streakDays, bestStreak: Math.max(bestStreak, streakDays), applicationsToday };
};

const cardClass =
    'box-border flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm';

const StreakCount = ({ userId = DEFAULT_USER_ID, dailyTarget = 8 }) => {
    const [countByDay, setCountByDay] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await analyticsService.getApplicationStatsByUserId(userId);
                // works whether responseGateway returns the axios response or the body
                const body = res?.data;
                const list = (Array.isArray(body) ? body : body?.data) || [];

                if (!cancelled) {
                    setCountByDay(Object.fromEntries(list.map((item) => [item.date, item.count])));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || 'Failed to load streak.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [userId]);

    const { streakDays, bestStreak, applicationsToday } = useMemo(
        () => calcStreaks(countByDay),
        [countByDay]
    );

    if (loading) {
        return (
            <section className={`${cardClass} items-center justify-center text-xs text-slate-500`}>
                Loading streak...
            </section>
        );
    }

    if (error) {
        return (
            <section className={`${cardClass} items-center justify-center text-xs text-red-600`}>
                {error}
            </section>
        );
    }

    const progress =
        dailyTarget > 0 ? Math.min((applicationsToday / dailyTarget) * 100, 100) : 0;
    const remaining = Math.max(dailyTarget - applicationsToday, 0);
    const streakActive = streakDays > 0;

    let message;
    if (applicationsToday === 0) {
        message = streakActive
            ? `Apply to a job today to keep your ${streakDays}-day streak alive.`
            : 'Apply to a job today to start a new streak.';
    } else if (remaining > 0) {
        message = `Today counts toward your streak. ${remaining} more ${remaining === 1 ? 'job' : 'jobs'} to hit your daily goal.`;
    } else {
        message = `Daily goal completed! Your ${streakDays}-day streak is safe. Keep it going.`;
    }

    return (
        <section className={cardClass}>
            {/* Header */}
            <div className="flex shrink-0 items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div className="flex min-w-0 items-center gap-1.5">
                    <span className="material-symbols-outlined !text-md text-amber-600">
                        local_fire_department
                    </span>
                    <span className="truncate text-[11px] font-bold uppercase tracking-wider text-amber-600">
                        {streakActive ? 'Streak Active' : 'Streak Inactive'}
                    </span>
                </div>

                <div className="flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5">
                    <span className="material-symbols-outlined text-[14px] leading-none text-amber-500">
                        emoji_events
                    </span>
                    <span className="text-[11px] font-medium leading-none text-slate-600">
                        Best: {bestStreak}d
                    </span>
                </div>
            </div>

            {/* Streak count */}
            <div className="mt-2 flex shrink-0 items-center gap-3">
                <span className="text-4xl font-bold leading-none tracking-tight text-amber-600">
                    {streakDays}
                </span>
                <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold leading-tight text-slate-900">
                        {streakDays === 1 ? 'Day Streak' : 'Days Streak'}
                    </h2>
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Unbroken Momentum
                    </p>
                </div>
            </div>

            {/* Message */}
            <p className="mt-2 line-clamp-2 shrink-0 text-xs leading-snug text-slate-600">
                {message}
            </p>

            {/* Flexible space */}
            <div className="min-h-0 flex-1" />

            {/* Daily progress */}
            <div className="shrink-0 border-t border-slate-200 pt-2">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="truncate text-xs font-medium text-slate-600">
                        Today's pace
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-amber-600">
                        {applicationsToday}/{dailyTarget}
                    </span>
                </div>

                <div
                    className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200"
                    role="progressbar"
                    aria-valuenow={applicationsToday}
                    aria-valuemin={0}
                    aria-valuemax={dailyTarget}
                    aria-label="Daily application progress"
                >
                    <div
                        className="h-full rounded-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </section>
    );
};

export default StreakCount;