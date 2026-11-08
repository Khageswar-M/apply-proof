import React from 'react';

const StreakCount = ({
    streakDays = 12,
    bestStreak = 19,
    applicationsToday = 6,
    dailyTarget = 8,
}) => {
    const progress =
        dailyTarget > 0 ? Math.min((applicationsToday / dailyTarget) * 100, 100) : 0;
    const remaining = Math.max(dailyTarget - applicationsToday, 0);
    const streakActive = streakDays > 0;

    return (
        <section className="box-border flex h-full min-h-0 w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
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
                        Days Streak
                    </h2>
                    <p className="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        Unbroken Momentum
                    </p>
                </div>
            </div>

            {/* Message */}
            <p className="mt-2 line-clamp-2 shrink-0 text-xs leading-snug text-slate-600">
                {remaining > 0
                    ? `Apply to ${remaining} more ${remaining === 1 ? 'job' : 'jobs'} today to keep your ${streakDays}-day streak alive.`
                    : `Daily goal completed! Your ${streakDays}-day streak is safe. Keep it going.`}
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