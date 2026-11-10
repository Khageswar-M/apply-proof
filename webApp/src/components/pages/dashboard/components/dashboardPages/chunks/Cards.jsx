import React, { useEffect, useMemo, useState } from 'react';
import analyticsService from '../../../../../../services/analyticsService'; // adjust path
import applicationService from '../../../../../../services/applicationService'; // adjust path

const DEFAULT_USER_ID = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30';

// statuses that count as an "active round"
const INTERVIEW_STATUSES = ['INTERVIEW_CALL', 'INTERVIEWED', 'FINAL_ROUND'];

/* ---------- helpers (local time, not UTC) ---------- */
const pad = (n) => String(n).padStart(2, '0');
const toDayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// works whether responseGateway returns the axios response or the body
const unwrapList = (res) => {
    const body = res?.data;
    return (Array.isArray(body) ? body : body?.data) || [];
};

// "Razorpay, Freshworks +2"
const joinCompanies = (apps, max = 3) => {
    const names = [...new Set(apps.map((a) => a.companyName))];
    if (!names.length) return '';
    const shown = names.slice(0, max).join(', ');
    return names.length > max ? `${shown} +${names.length - max}` : shown;
};

const Cards = ({ userId = DEFAULT_USER_ID, weeklyGoal = 7 }) => {
    const [stats, setStats] = useState([]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const [statsRes, appsRes] = await Promise.all([
                    analyticsService.getApplicationStatsByUserId(userId),
                    applicationService.getApplicationsByUserId(userId),
                ]);
                if (!cancelled) {
                    setStats(unwrapList(statsRes));
                    setApplications(unwrapList(appsRes));
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || 'Failed to load summary.');
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

    const cards = useMemo(() => {
        // total + this week (last 7 days incl. today) from the daily counts
        const countByDay = Object.fromEntries(stats.map((s) => [s.date, s.count]));
        const total = stats.reduce((sum, s) => sum + s.count, 0);

        let week = 0;
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            week += countByDay[toDayKey(d)] || 0;
        }

        // interviews + offers from the application statuses
        const interviews = applications.filter((a) => INTERVIEW_STATUSES.includes(a.currentStatus));
        const offers = applications.filter((a) => a.currentStatus === 'OFFER');

        return [
            {
                title: 'TOTAL APPLIED',
                value: total,
                subtitle: total === 1 ? 'application' : 'applications',
                icon: 'send',
                iconBg: 'bg-blue-50',
                iconColor: 'text-sky-700',
                footerIcon: 'trending_up',
                footer: `+${week} this week`,
                footerColor: 'text-emerald-700',
            },
            {
                title: 'THIS WEEK',
                value: week,
                subtitle: week === 1 ? 'application' : 'applications',
                icon: 'calendar_month',
                iconBg: 'bg-cyan-50',
                iconColor: 'text-cyan-700',
                footerIcon: 'fiber_manual_record',
                footer:
                    week >= weeklyGoal
                        ? `Weekly goal reached (${week}/${weeklyGoal})`
                        : `${weeklyGoal - week} more to hit weekly goal (${week}/${weeklyGoal})`,
                footerColor: 'text-slate-500',
            },
            {
                title: 'INTERVIEWS',
                value: interviews.length,
                subtitle: 'active rounds',
                icon: 'groups',
                iconBg: 'bg-sky-50',
                iconColor: 'text-sky-700',
                footer: joinCompanies(interviews) || 'No active rounds',
                footerColor: 'text-slate-500',
            },
            {
                title: 'OFFERS RECEIVED',
                value: offers.length,
                subtitle: offers.length === 1 ? 'offer received' : 'offers received',
                icon: 'workspace_premium',
                iconBg: 'bg-orange-100',
                iconColor: 'text-amber-800',
                footerIcon: offers.length ? 'monetization_on' : undefined,
                footer: joinCompanies(offers) || 'No offers yet',
                footerColor: offers.length ? 'text-amber-800' : 'text-slate-500',
            },
        ];
    }, [stats, applications, weeklyGoal]);

    if (error) {
        return (
            <section className="w-full rounded-xl border border-stone-200 bg-white p-4 text-center text-sm text-red-600 shadow-sm">
                {error}
            </section>
        );
    }

    return (
        <section className="w-full max-h-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card) => (
                <div
                    key={card.title}
                    className="min-w-0 rounded-xl border border-stone-200 bg-white p-4 shadow-sm flex flex-col justify-between gap-2"
                >
                    {/* Card Header */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-[9px] font-semibold tracking-[0.08em] text-slate-500">
                            {card.title}
                        </h3>

                        <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                            <span className={`material-symbols-outlined text-[16px] ${card.iconColor}`}>
                                {card.icon}
                            </span>
                        </div>
                    </div>

                    {/* Card Value */}
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-semibold tracking-tight text-slate-900">
                            {loading ? '–' : card.value}
                        </span>
                        <span className="text-[10px] text-slate-500">
                            {card.subtitle}
                        </span>
                    </div>

                    {/* Card Footer */}
                    <div className={`flex items-center gap-1.5 ${card.footerColor}`}>
                        {card.footerIcon && (
                            <span className="material-symbols-outlined text-[12px]">
                                {card.footerIcon}
                            </span>
                        )}

                        <p className="text-[9px] font-medium truncate">
                            {loading ? 'Loading...' : card.footer}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default Cards;