import React from 'react';

const STATUS_STYLES = {
  APPLIED: 'bg-blue-50 text-blue-700 ring-blue-200',
  'INTERVIEW CALL': 'bg-purple-50 text-purple-700 ring-purple-200',
  ASSESSMENT: 'bg-orange-50 text-orange-700 ring-orange-200',
  INTERVIEWED: 'bg-teal-50 text-teal-700 ring-teal-200',
  SHORTLISTED: 'bg-amber-50 text-amber-700 ring-amber-200',
  'FINAL DISCUSSION': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  OFFER: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJECTED: 'bg-red-50 text-red-600 ring-red-200',
};

const REFERENCE_STYLES = {
  OFFER: 'text-emerald-700',
  SHORTLISTED: 'text-amber-700',
};

const STATUSES = Object.keys(STATUS_STYLES);

const AVATAR_COLORS = [
  'bg-blue-50 text-blue-600',
  'bg-purple-50 text-purple-600',
  'bg-emerald-50 text-emerald-600',
  'bg-teal-50 text-teal-600',
  'bg-amber-50 text-amber-600',
  'bg-red-50 text-red-600',
];

const SOURCE_ICONS = {
  Referral: 'group',
  'Company Website': 'language',
};

// Same company always gets the same color, even if the list order changes
const getAvatarColor = (name = '') =>
  AVATAR_COLORS[
    [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length
  ];

const getInitial = (name = '') => name.trim().charAt(0).toUpperCase();

const SAMPLE_APPLICATIONS = [
  {
    id: 1,
    company: 'Infosys',
    category: 'Information Tech',
    position: 'Java Full Stack Developer',
    source: 'LinkedIn',
    appliedDate: '28 Oct 2024',
    resume: 'Resume_Java_v2.pdf',
    status: 'APPLIED',
    reference: 'Ref: INF-881',
  },
  {
    id: 2,
    company: 'Razorpay',
    category: 'Fintech Core',
    position: 'React Native Developer',
    source: 'Referral',
    appliedDate: '24 Oct 2024',
    resume: 'Resume_FullStack_v3.pdf',
    status: 'INTERVIEW CALL',
    reference: 'R1 Scheduled',
  },
  {
    id: 3,
    company: 'TCS Innovations',
    category: 'Enterprise Cloud',
    position: 'Cloud Solutions Architect',
    source: 'Naukri',
    appliedDate: '18 Oct 2024',
    resume: 'Resume_Cloud_v1.pdf',
    status: 'OFFER',
    reference: 'Reviewing Package',
  },
  {
    id: 4,
    company: 'Freshworks',
    category: 'SaaS Product',
    position: 'UI Platform Engineer',
    source: 'Company Website',
    appliedDate: '15 Oct 2024',
    resume: 'Resume_Frontend_v4.pdf',
    status: 'INTERVIEWED',
    reference: 'Debrief pending',
  },
  {
    id: 5,
    company: 'Swiggy',
    category: 'Consumer Tech',
    position: 'Senior Backend Engineer',
    source: 'Indeed',
    appliedDate: '10 Oct 2024',
    resume: 'Resume_Backend_v2.pdf',
    status: 'SHORTLISTED',
    reference: 'Send ping',
    followUp: 'Follow-up window: 18 days ago',
  },
  {
    id: 6,
    company: 'Wipro',
    category: 'Global Tech Services',
    position: 'Associate Software Engineer',
    source: 'LinkedIn',
    appliedDate: '28 Sep 2024',
    resume: 'Resume_General_v1.pdf',
    status: 'REJECTED',
    reference: 'Archived',
  },
];

const ApplicationCards = ({
  applications = SAMPLE_APPLICATIONS,
  onStatusChange,
  onResumeView,
}) => {
  if (!applications.length) {
    return (
      <div className="w-full rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-slate-500">
        No applications yet.
      </div>
    );
  }

  return (
    <section className="grid w-full grid-cols-1 gap-4 pb-5 sm:grid-cols-2 xl:grid-cols-3">
      {applications.map((app) => (
        <article
          key={app.id}
          className="flex min-w-0 flex-col rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${getAvatarColor(app.company)}`}
              >
                {getInitial(app.company)}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-slate-900" title={app.company}>
                  {app.company}
                </h3>
                <p className="truncate text-xs text-slate-500" title={app.category}>
                  {app.category}
                </p>
              </div>
            </div>

            <span
              className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${
                STATUS_STYLES[app.status] || 'bg-slate-100 text-slate-600 ring-slate-200'
              }`}
            >
              {app.status}
            </span>
          </div>

          {/* Position */}
          <p
            className="mt-3 truncate text-sm font-medium text-slate-800"
            title={app.position}
          >
            {app.position}
          </p>

          {/* Source & date */}
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-slate-500">
            <span className="material-symbols-outlined text-base leading-none !text-sm">
              {SOURCE_ICONS[app.source] || 'travel_explore'}
            </span>
            <span>{app.source}</span>
            <span aria-hidden="true">·</span>
            <span>Applied {app.appliedDate}</span>
          </div>

          {/* Follow-up */}
          {/* {app.followUp && (
            <div className="mt-3 flex items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1.5 text-xs text-amber-700">
              <span className="material-symbols-outlined !text-sm leading-none">schedule</span>
              {app.followUp}
            </div>
          )} */}

          {/* Bottom section */}
          <div className="mt-auto pt-4">
            <button
              type="button"
              onClick={() => onResumeView?.(app)}
              aria-label={`View resume ${app.resume}`}
              className="group flex w-full items-center justify-between gap-2 border-t border-stone-100 pt-3 text-left text-xs text-slate-600 transition-colors hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="material-symbols-outlined !text-sm shrink-0 text-base leading-none">
                  description
                </span>
                <span className="truncate">{app.resume}</span>
              </span>
              <span className="material-symbols-outlined shrink-0 !text-sm leading-none text-slate-400 group-hover:text-teal-700">
                visibility
              </span>
            </button>

            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="relative shrink-0">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) onStatusChange?.(app.id, e.target.value);
                  }}
                  aria-label={`Update status for ${app.company}`}
                  className="cursor-pointer appearance-none rounded-md border border-stone-200 bg-white py-1 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-stone-300 focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <option value="" disabled>
                    Update status
                  </option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-base leading-none text-slate-500">
                  keyboard_arrow_down
                </span>
              </div>

              <span
                className={`truncate text-right text-xs ${
                  REFERENCE_STYLES[app.status] || 'text-slate-500'
                }`}
                title={app.reference}
              >
                {app.reference}
              </span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

export default ApplicationCards;