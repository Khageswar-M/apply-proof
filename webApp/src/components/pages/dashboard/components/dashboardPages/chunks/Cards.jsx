
import React from 'react';

const Cards = () => {
    const cards = [
        {
            title: 'TOTAL APPLIED',
            value: '18',
            subtitle: 'applications',
            icon: 'send',
            iconBg: 'bg-blue-50',
            iconColor: 'text-sky-700',
            footerIcon: 'trending_up',
            footer: '+3 this week',
            footerColor: 'text-emerald-700',
        },
        {
            title: 'THIS WEEK',
            value: '5',
            subtitle: 'applications',
            icon: 'calendar_month',
            iconBg: 'bg-cyan-50',
            iconColor: 'text-cyan-700',
            footerIcon: 'fiber_manual_record',
            footer: 'On track with weekly goal (5/7)',
            footerColor: 'text-slate-500',
        },
        {
            title: 'INTERVIEWS',
            value: '3',
            subtitle: 'active rounds',
            icon: 'groups',
            iconBg: 'bg-sky-50',
            iconColor: 'text-sky-700',
            footer: 'Razorpay, Freshworks, Infosys',
            footerColor: 'text-slate-500',
        },
        {
            title: 'OFFERS RECEIVED',
            value: '1',
            subtitle: 'offer received',
            icon: 'workspace_premium',
            iconBg: 'bg-orange-100',
            iconColor: 'text-amber-800',
            footerIcon: 'monetization_on',
            footer: 'TCS Innovations',
            footerColor: 'text-amber-800',
        },
    ];

    return (
        <section className="w-full max-h-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {cards.map((card, index) => (
                <div
                    key={index}
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
                            {card.value}
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
                            {card.footer}
                        </p>
                    </div>
                </div>
            ))}

        </section>
    );
};

export default Cards;
