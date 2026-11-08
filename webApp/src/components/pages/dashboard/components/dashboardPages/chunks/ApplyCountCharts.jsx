import { useMemo, useState } from 'react';

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

// Sample chart data
const chartData = [
    { month: "Jan", applications: 12 },
    { month: "Feb", applications: 19 },
    { month: "Mar", applications: 15 },
    { month: "Apr", applications: 25 },
    { month: "May", applications: 18 },
    { month: "Jun", applications: 32 },
    { month: "Jul", applications: 28 },
    { month: "Aug", applications: 36 },
    { month: "Sep", applications: 22 },
    { month: "Oct", applications: 40 },
    { month: "Nov", applications: 31 },
    { month: "Dec", applications: 45 },
];

const chartConfig = {
    applications: {
        label: "Applications",
        color: "var(--chart-2)",
    },
};

const chartPeriods = [
    { label: '7D', count: 7 },
    { label: '30D', count: 12 },
    { label: '6M', count: 6 },
    { label: '1Y', count: 12 },
];

const ApplyCountCharts = () => {
    const [period, setPeriod] = useState(0);

    const filteredChartData = useMemo(
        () => chartData.slice(-chartPeriods[period].count),
        [period]
    );

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
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />

                        <Bar
                            dataKey="applications"
                            fill="var(--color-applications)"
                            radius={[5, 5, 0, 0]}
                            maxBarSize={45}
                        >
                            <LabelList
                                dataKey="applications"
                                position="top"
                                offset={6}
                                className="fill-neutral-600"
                                fontSize={11}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    );
};

export default ApplyCountCharts;