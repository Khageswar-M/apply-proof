import { useEffect, useMemo, useState } from 'react';

import {
    Bar,
    BarChart,
    CartesianGrid,
    LabelList,
    XAxis,
} from 'recharts';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';

import analyticsService from '../../../../../../services/analyticsService'; // adjust path

const DEFAULT_USER_ID = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30';

const chartConfig = {
    applications: {
        label: "Applications",
        color: "var(--chart-2)",
    },
};

// mode "day" = one bar per day, "month" = one bar per month
const chartPeriods = [
    { label: '7D', mode: 'day', count: 7 },
    { label: '30D', mode: 'day', count: 30 },
    { label: '6M', mode: 'month', count: 6 },
    { label: '1Y', mode: 'month', count: 12 },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* ---------- date helpers (local time, not UTC) ---------- */
const pad = (n) => String(n).padStart(2, '0');
const toDayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toMonthKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;

// last `count` days, missing days filled with 0
const buildDaily = (countByDay, count) => {
    const rows = [];
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        rows.push({
            tick: count <= 7 ? `${d.getDate()} ${MONTHS[d.getMonth()]}` : String(d.getDate()),
            label: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
            applications: countByDay[toDayKey(d)] || 0,
        });
    }
    return rows;
};

// last `count` months, summed from the daily counts
const buildMonthly = (countByDay, count) => {
    const countByMonth = {};
    Object.entries(countByDay).forEach(([day, n]) => {
        const key = day.slice(0, 7); // "2026-11"
        countByMonth[key] = (countByMonth[key] || 0) + n;
    });

    const rows = [];
    const now = new Date();
    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        rows.push({
            tick: MONTHS[d.getMonth()],
            label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
            applications: countByMonth[toMonthKey(d)] || 0,
        });
    }
    return rows;
};

const ApplyCountCharts = ({ userId = DEFAULT_USER_ID }) => {
    const [period, setPeriod] = useState(0);
    const [countByDay, setCountByDay] = useState({}); // { "2026-11-10": 8 }
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
                    setCountByDay(
                        Object.fromEntries(list.map((item) => [item.date, item.count]))
                    );
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err?.response?.data?.message || 'Failed to load stats.');
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

    const filteredChartData = useMemo(() => {
        const { mode, count } = chartPeriods[period];
        return mode === 'day' ? buildDaily(countByDay, count) : buildMonthly(countByDay, count);
    }, [countByDay, period]);

    // 30 bars is too crowded for value labels
    const showLabels = filteredChartData.length <= 12;

    return (
        <div className="apply-count-charts-container flex h-50 max-full w-full flex-col overflow-hidden p-5 shadow">

            {/* Header */}
            <div className="flex shrink-0 flex-row items-center justify-between">
                <div className="flex flex-col items-start">
                    <p className="text-sm font-bold text-neutral-950">
                        Daily Applications
                    </p>
                    <p className="text-xs text-neutral-600">
                        Target: 1-3 disciplined submissions per day
                    </p>
                </div>

                <div className="flex flex-row items-center gap-1 rounded-sm bg-primary-100 p-1 shadow">
                    {chartPeriods.map((item, idx) => (
                        <button
                            key={item.label}
                            className={`w-10 cursor-pointer rounded-sm px-2 py-1 text-xs transition-colors ${
                                period === idx
                                    ? 'bg-white font-medium shadow'
                                    : 'text-neutral-800 hover:bg-white/50'
                            }`}
                            onClick={() => setPeriod(idx)}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart: fills all remaining height and the full width */}
            <div className="mt-2 min-h-0 w-full flex-1">
                {loading ? (
                    <div className="flex h-full items-center justify-center text-xs text-neutral-500">
                        Loading stats...
                    </div>
                ) : error ? (
                    <div className="flex h-full items-center justify-center text-xs text-red-600">
                        {error}
                    </div>
                ) : (
                    <ChartContainer
                        config={chartConfig}
                        className="aspect-auto h-full w-full"
                    >
                        <BarChart
                            accessibilityLayer
                            data={filteredChartData}
                            margin={{ top: 16, right: 0, bottom: 0, left: 0 }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />

                            <XAxis
                                dataKey="tick"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={8}
                            />

                            <ChartTooltip
                                cursor={false}
                                content={
                                    <ChartTooltipContent
                                        labelFormatter={(_, payload) => payload?.[0]?.payload?.label}
                                    />
                                }
                            />

                            <Bar
                                dataKey="applications"
                                fill="var(--color-applications)"
                                radius={[5, 5, 0, 0]}
                                maxBarSize={45}
                            >
                                {showLabels && (
                                    <LabelList
                                        dataKey="applications"
                                        position="top"
                                        offset={6}
                                        className="fill-neutral-600"
                                        fontSize={11}
                                        formatter={(v) => (v ? v : '')} // no "0" labels on empty bars
                                    />
                                )}
                            </Bar>
                        </BarChart>
                    </ChartContainer>
                )}
            </div>
        </div>
    );
};

export default ApplyCountCharts;