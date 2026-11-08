
import React from 'react';

const RecentApplicationsTable = ({
    applications = [
        {
            id: 1,
            company: 'Infosys',
            position: 'Java Full Stack Developer',
            source: 'LinkedIn',
            resume: 'Resume_FullStack_v3',
            date: 'Oct 28',
            status: 'APPLIED',
        },
        {
            id: 2,
            company: 'Razorpay',
            position: 'React Native Developer',
            source: 'Referral',
            resume: 'Resume_Mobile_v2',
            date: 'Oct 24',
            status: 'INTERVIEW CALL',
        },
        {
            id: 3,
            company: 'TCS Innovations',
            position: 'Cloud Solutions Architect',
            source: 'Naukri',
            resume: 'Resume_CloudArch_v1',
            date: 'Oct 18',
            status: 'OFFER',
        },
        {
            id: 4,
            company: 'Freshworks',
            position: 'UI Platform Engineer',
            source: 'Company Website',
            resume: 'Resume_FullStack_v3',
            date: 'Oct 15',
            status: 'INTERVIEWED',
        },
        {
            id: 5,
            company: 'Wipro',
            position: 'Backend Developer (Spring Boot)',
            source: 'Indeed',
            resume: 'Resume_Backend_v2',
            date: 'Oct 12',
            status: 'SHORTLISTED',
        },
    ],
    onViewAll,
    onApplicationClick,
}) => {

    const visibleApplications = applications.slice(0, 10);

    const statusStyles = {
        APPLIED: 'bg-blue-50 text-blue-600',
        'INTERVIEW CALL': 'bg-purple-50 text-purple-600',
        INTERVIEWED: 'bg-teal-50 text-teal-600',
        SHORTLISTED: 'bg-amber-50 text-amber-600',
        OFFER: 'bg-emerald-50 text-emerald-600',
        REJECTED: 'bg-red-50 text-red-600',
        'FINAL DISCUSSION': 'bg-indigo-50 text-indigo-600',
        ASSESSMENT: 'bg-orange-50 text-orange-600',
    };

    const getInitials = (company) => {
        return company
            .split(' ')
            .map(word => word[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <section className="w-full rounded-xl border border-stone-200 bg-white p-4 shadow-sm">

            {/* Header */}
            <div className="mb-5 flex items-center justify-between">

                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Recent Applications
                    </h2>

                    <p className="mt-0.5 text-[10px] text-slate-500">
                        Logged applications and status pipelines
                    </p>
                </div>

                {applications.length > 10 && (
                    <button
                        onClick={onViewAll}
                        className="flex items-center gap-1 text-[10px] font-medium text-teal-700 transition-colors hover:text-teal-900"
                    >
                        View all ({applications.length})

                        <span className="material-symbols-outlined text-sm">
                            arrow_forward
                        </span>
                    </button>
                )}

            </div>

            {/* Applications List */}
            <div className="flex flex-col">

                {visibleApplications.length > 0 ? (
                    visibleApplications.map((application) => (

                        <div
                            key={application.id}
                            onClick={() => onApplicationClick?.(application)}
                            className="group flex min-w-0 cursor-pointer items-center gap-2.5 rounded-lg px-1.5 py-2.5 transition-colors hover:bg-slate-50 sm:gap-3"
                        >

                            {/* Company Initials */}
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[10px] font-semibold text-blue-600">
                                {getInitials(application.company)}
                            </div>

                            {/* Application Details */}
                            <div className="min-w-0 flex-1">

                                <div className="flex min-w-0 items-center gap-1.5">

                                    <h3 className="shrink-0 truncate text-[11px] font-semibold text-slate-800">
                                        {application.company}
                                    </h3>

                                    <span className="shrink-0 text-[10px] text-slate-400">
                                        ·
                                    </span>

                                    <p className="truncate text-[10px] text-slate-600">
                                        {application.position}
                                    </p>

                                </div>

                                <p className="mt-0.5 truncate text-[9px] text-slate-500">
                                    {application.source}
                                    <span className="mx-1">·</span>
                                    {application.resume}
                                    <span className="mx-1">·</span>
                                    {application.date}
                                </p>

                            </div>

                            {/* Status Badge */}
                            <div className="hidden shrink-0 sm:block">

                                <span
                                    className={`rounded px-2 py-1 text-[8px] font-semibold tracking-wide ${
                                        statusStyles[application.status] ||
                                        'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {application.status}
                                </span>

                            </div>

                            {/* More Options */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onApplicationClick?.(application);
                                }}
                                className="flex h-7 w-6 shrink-0 items-center justify-center rounded-md text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-900"
                                aria-label={`Options for ${application.company}`}
                            >
                                <span className="material-symbols-outlined text-base">
                                    more_vert
                                </span>
                            </button>

                        </div>

                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                        <span className="material-symbols-outlined mb-2 text-3xl text-slate-300">
                            work_history
                        </span>

                        <p className="text-xs font-medium text-slate-600">
                            No applications yet
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                            Your recent applications will appear here.
                        </p>
                    </div>
                )}

            </div>

        </section>
    );
};

export default RecentApplicationsTable;
