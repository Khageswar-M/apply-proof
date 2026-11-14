import React, { useEffect, useState } from 'react';
import { setUpdateDrawerOpen, setUpdateObject } from '../../../../../redux/appSlice';
import { useDispatch } from 'react-redux';
import applicationService from '../../../../../../services/applicationService';

const DEFAULT_USER_ID = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30';

// Keys now match the backend enum values exactly
const STATUS_STYLES = {
  APPLIED: 'bg-blue-50 text-blue-700 ring-blue-200',
  INTERVIEW_CALL: 'bg-purple-50 text-purple-700 ring-purple-200',
  ASSESSMENT: 'bg-orange-50 text-orange-700 ring-orange-200',
  INTERVIEWED: 'bg-teal-50 text-teal-700 ring-teal-200',
  SHORTLISTED: 'bg-amber-50 text-amber-700 ring-amber-200',
  FINAL_ROUND: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
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

const SOURCE_LABELS = {
  LINKEDIN: 'LinkedIn',
  INDEED: 'Indeed',
  NAUKRI: 'Naukri',
  REFERRAL: 'Referral',
  COMPANY_WEBSITE: 'Company Website',
};

const SOURCE_ICONS = {
  Referral: 'group',
  'Company Website': 'language',
};

const formatStatus = (s = '') => s.replace(/_/g, ' ');

const formatSource = (s = '') =>
  SOURCE_LABELS[s] ||
  s.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (iso) => {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Backend shape -> card shape (raw fields are kept for the edit drawer)
const toCard = (a) => ({
  ...a,
  company: a.companyName,
  position: a.jobRole,
  source: formatSource(a.jobBoard),
  appliedDate: formatDate(a.appliedDateTime),
  resume: a.appliedResumeName,
  status: a.currentStatus,
  reference: a.note,
});

// Same company always gets the same color, even if the list order changes
const getAvatarColor = (name = '') =>
  AVATAR_COLORS[
  [...name].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length
  ];

const getInitial = (name = '') => name.trim().charAt(0).toUpperCase();

const ApplicationCards = ({ userId = DEFAULT_USER_ID, onStatusChange, onResumeView }) => {
  const dispatch = useDispatch(); // hooks first
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await applicationService.getApplicationsByUserId(userId);
        // works whether responseGateway returns the axios response or the body
        const body = res?.data;
        const list = Array.isArray(body) ? body : body?.data;

        if (!cancelled) {
          setApplications(
            (list || [])
              .map(toCard)
              .sort((a, b) => new Date(b.appliedDateTime) - new Date(a.appliedDateTime))
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.message || 'Failed to load applications.');
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

  const handleUpdate = (application) => {
    dispatch(setUpdateObject(application));
    dispatch(setUpdateDrawerOpen(true));
  };

  const handleStatusChange = (id, status) => {
    // optimistic local update; hook up the update API here when ready
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, currentStatus: status } : a))
    );
    onStatusChange?.(id, status);
  };

  const messageBox = 'w-full rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm';

  if (loading) return <div className={`${messageBox} text-slate-500`}>Loading applications...</div>;
  if (error) return <div className={`${messageBox} text-red-600`}>{error}</div>;
  if (!applications.length) return <div className={`${messageBox} text-slate-500`}>No applications yet.</div>;

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
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // the card itself is clickable, so don't fire it twice
                  handleUpdate(app);
                }}
                aria-label={`Edit ${app.company}`}
                title="Edit"
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-teal-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px] leading-none">edit_square</span>
              </button>

              <span
                className={`shrink-0 whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${
                  STATUS_STYLES[app.status] || 'bg-slate-100 text-slate-600 ring-slate-200'
                }`}
              >
                {formatStatus(app.status)}
              </span>
            </div>
          </div>

          {/* Position */}
          <p className="mt-3 truncate text-sm font-medium text-slate-800" title={app.position}>
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
                    if (e.target.value) handleStatusChange(app.id, e.target.value);
                  }}
                  aria-label={`Update status for ${app.company}`}
                  className="cursor-pointer appearance-none rounded-md border border-stone-200 bg-white py-1 pl-2.5 pr-7 text-xs font-medium text-slate-700 outline-none transition-colors hover:border-stone-300 focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <option value="" disabled>
                    Update status
                  </option>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {formatStatus(s)}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-base leading-none text-slate-500">
                  keyboard_arrow_down
                </span>
              </div>

              <span
                className={`truncate text-right text-xs ${REFERENCE_STYLES[app.status] || 'text-slate-500'}`}
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