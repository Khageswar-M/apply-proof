import React, { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setUpdateDrawerOpen, setUpdateObject } from '../../../../../redux/appSlice';


const JOB_BOARDS = [
  { value: 'LINKEDIN', label: 'LinkedIn' },
  { value: 'NAUKRI', label: 'Naukri' },
  { value: 'INDEED', label: 'Indeed' },
  { value: 'CUTSHORT', label: 'Cutshort' },
  { value: 'INSTAHYRE', label: 'Instahyre' },
  { value: 'CAREER_SITE', label: 'Career Site' },
];

const STATUSES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW CALL', 'INTERVIEWED', 'FINAL ROUND', 'OFFER', 'REJECTED'];

/* ---------- date / time helpers (local time, not UTC) ---------- */
const pad = (n) => String(n).padStart(2, '0');


const getToday = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};



const getNow = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const initialForm = () => ({
  companyName: '',
  jobBoard: 'LINKEDIN',
  jobRole: '',
  resumeName: '',
  status: 'APPLIED',
  appliedDate: getToday(),
  appliedTime: getNow(),
  notes: '',
});

// turns a saved application back into the form's shape
const formFromApplication = (a) => {
  const d = new Date(a.appliedAt);
  const validDate = !isNaN(d);

  return {
    companyName: a.companyName ?? a.company ?? '',
    jobBoard: a.jobBoard ?? a.board ?? 'LINKEDIN',
    jobRole: a.position ?? a.role ?? '',
    resumeName: a.resumeName ?? a.resume ?? '',
    status: (a.status ?? 'APPLIED').replace(/_/g, ' '),   // INTERVIEW_CALL -> INTERVIEW CALL
    appliedDate: validDate ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : getToday(),
    appliedTime: validDate ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : getNow(),
    notes: a.notes ?? '',
  };
};

/* ---------- validation ---------- */
const checkText = (value, label, min = 2, max = 100) => {
  const v = value.trim();
  if (!v) return `Enter the ${label}`;
  if (v.length < min) return `Use at least ${min} characters`;
  if (v.length > max) return `Keep it under ${max} characters`;
  return '';
};

const validate = (f) => {
  const e = {};

  const company = checkText(f.companyName, 'company name');
  if (company) e.companyName = company;

  const role = checkText(f.jobRole, 'job role');
  if (role) e.jobRole = role;

  const resume = checkText(f.resumeName, 'resume name');
  if (resume) e.resumeName = resume;

  if (!JOB_BOARDS.some((b) => b.value === f.jobBoard)) e.jobBoard = 'Pick a job board';
  if (!STATUSES.includes(f.status)) e.status = 'Pick a status';

  if (!f.appliedDate) e.appliedDate = 'Pick the date you applied';
  else if (f.appliedDate > getToday()) e.appliedDate = "Date can't be in the future";

  if (!f.appliedTime) e.appliedTime = 'Pick the time you applied';
  else if (!e.appliedDate && new Date(`${f.appliedDate}T${f.appliedTime}`) > new Date()) {
    e.appliedTime = "Time can't be in the future";
  }

  return e;
};

/* ---------- request "record" (matches CreateApplicationRequest in Java) ---------- */
export const createApplicationRequest = (f) =>
  Object.freeze({
    companyName: f.companyName.trim(),
    jobBoard: f.jobBoard,                                   // LINKEDIN, NAUKRI...
    jobRole: f.jobRole.trim(),
    resumeName: f.resumeName.trim(),
    status: f.status.replace(/ /g, '_'),                    // INTERVIEW_CALL
    appliedAt: new Date(`${f.appliedDate}T${f.appliedTime}`).toISOString(), // Instant
    notes: f.notes.trim() || null,
  });

/* ---------- small UI helpers ---------- */
const box = (hasError) =>
  `group flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-white border transition focus-within:ring-4 ${hasError
    ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-100'
    : 'border-gray-200 focus-within:border-emerald-600 focus-within:ring-emerald-100'
  }`;

const ICON =
  'material-symbols-outlined shrink-0 text-[20px] text-gray-400 transition-colors group-focus-within:text-emerald-600';

const INPUT = 'flex-1 min-w-0 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none';

// hides the browser's default calendar/clock icon so only ours shows
const hideNative = '[&::-webkit-calendar-picker-indicator]:hidden';

const Field = ({ label, htmlFor, required, optional, error, children }) => (
  <div className='flex flex-col gap-1.5'>
    <label htmlFor={htmlFor} className='text-sm'>
      {label}{' '}
      {required && <span className='text-xs text-danger'>*</span>}
      {optional && <span className='text-gray-500'>(Optional)</span>}
    </label>
    {children}
    {error && <p className='text-xs text-danger' role='alert'>{error}</p>}
  </div>
);

/* ---------- form ---------- */
const ApplicationFormInner = ({ application, onSubmit = async (payload, id) => console.log(id, payload) }) => {
  const dispatch = useDispatch();
  const isEdit = !!application;

  const baseForm = () => (isEdit ? formFromApplication(application) : initialForm());

  const [form, setForm] = useState(baseForm);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const dateRef = useRef(null);
  const timeRef = useRef(null);


  const errors = validate(form);
  const err = (name) => (touched[name] ? errors[name] : undefined);

  const bind = (name) => ({
    value: form[name],
    onChange: (e) => setForm((f) => ({ ...f, [name]: e.target.value })),
    onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    'aria-invalid': !!err(name),
  });

  const openPicker = (ref) => {
    try { ref.current?.showPicker(); } catch { ref.current?.focus(); }
  };

  const handleClear = () => {
    setForm(baseForm());      // add mode: empty form, edit mode: original values
    setTouched({});
    setSubmitError('');
  };

  const closeDrawer = () => {
    dispatch(setUpdateDrawerOpen(false));
    dispatch(setUpdateObject(null));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(form).map((k) => [k, true])));
    if (Object.keys(errors).length) return;

    try {
      setSaving(true);
      setSubmitError('');
      await onSubmit(createApplicationRequest(form), application?.id);

      if (isEdit) closeDrawer();
      else handleClear();
    } catch {
      setSubmitError(`Could not ${isEdit ? 'update' : 'save'} the application. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='w-full text-left flex flex-col items-center'>
      <div className='max-w-150 w-full'>
        <form
          noValidate
          onSubmit={handleSubmit}
          className='flex flex-col gap-5 bg-white p-5 rounded-md shadow'
        >
          <p className='flex flex-col'>
            <span className='text-md font-bold'>
              {isEdit ? 'Update application' : 'Add new application'}
            </span>
            <span className='text-xs text-neutral-500'>
              {isEdit ? 'Edit the details of this application.' : 'Log a new application into your private journal.'}
            </span>
          </p>

          <Field label='Company Name' htmlFor='companyName' required error={err('companyName')}>
            <div className={box(err('companyName'))}>
              <input id='companyName' type='text' placeholder='e.g. Infosys' className={INPUT} {...bind('companyName')} />
              <span className={ICON}>apartment</span>
            </div>
          </Field>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
            <Field label='Job Board' htmlFor='jobBoard' required error={err('jobBoard')}>
              <div className={box(err('jobBoard'))}>
                <select id='jobBoard' className={`${INPUT} appearance-none cursor-pointer`} {...bind('jobBoard')}>
                  {JOB_BOARDS.map((b) => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
                <span className={`${ICON} pointer-events-none`}>expand_more</span>
              </div>
            </Field>

            <Field label='Job Role / Title' htmlFor='jobRole' required error={err('jobRole')}>
              <div className={box(err('jobRole'))}>
                <input id='jobRole' type='text' placeholder='e.g. Java Full Stack Developer' className={INPUT} {...bind('jobRole')} />
                <span className={ICON}>work</span>
              </div>
            </Field>
          </div>

          <Field label='Applied Resume Name' htmlFor='resumeName' required error={err('resumeName')}>
            <div className={box(err('resumeName'))}>
              <input id='resumeName' type='text' placeholder='e.g. Resume_Java_v2.pdf' className={INPUT} {...bind('resumeName')} />
              <span className={ICON}>description</span>
            </div>
          </Field>

          <Field label='Current Status'>
            <div className='flex flex-wrap gap-3'>
              {STATUSES.map((sts) => (
                <span
                  key={sts}
                  onClick={() => setForm((f) => ({ ...f, status: sts }))}
                  className={`text-xs shadow cursor-pointer px-2 py-1 rounded-md transition-colors ${form.status === sts ? 'bg-emerald-600 text-white' : 'bg-white'
                    }`}
                >
                  {sts}
                </span>
              ))}
            </div>
          </Field>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 items-start'>
            <Field label='Applied Date' htmlFor='appliedDate' required error={err('appliedDate')}>
              <div className={box(err('appliedDate'))}>
                <input
                  id='appliedDate'
                  ref={dateRef}
                  type='date'
                  max={getToday()}
                  className={`${INPUT} ${hideNative}`}
                  {...bind('appliedDate')}
                />
                <button
                  type='button'
                  onClick={() => openPicker(dateRef)}
                  aria-label='Open calendar'
                  className={`${ICON} hover:text-emerald-600`}
                >
                  calendar_month
                </button>
              </div>
            </Field>

            <Field label='Applied Time' htmlFor='appliedTime' required error={err('appliedTime')}>
              <div className={box(err('appliedTime'))}>
                <input
                  id='appliedTime'
                  ref={timeRef}
                  type='time'
                  className={`${INPUT} ${hideNative}`}
                  {...bind('appliedTime')}
                />
                <button
                  type='button'
                  onClick={() => openPicker(timeRef)}
                  aria-label='Open time picker'
                  className={`${ICON} hover:text-emerald-600`}
                >
                  schedule
                </button>
              </div>
            </Field>
          </div>

          <Field label='Note' htmlFor='notes' optional>
            <div className={box(false)}>
              <textarea
                id='notes'
                rows={4}
                maxLength={500}
                placeholder='Referral from someone? Recruiter name? What to prepare before the call?'
                className={`${INPUT} resize-none`}
                {...bind('notes')}
              />
            </div>
            <p className='text-xs text-gray-400 text-right'>{form.notes.length}/500</p>
          </Field>

          {submitError && <p className='text-sm text-danger' role='alert'>{submitError}</p>}

          <div className='flex flex-row items-center gap-3 pt-2'>
            <button
              type='submit'
              disabled={saving}
              className='flex flex-1 sm:flex-none items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white text-sm font-semibold transition hover:bg-emerald-700 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              <span className='material-symbols-outlined text-[20px]'>
                {isEdit ? 'edit_square' : 'bookmark_added'}
              </span>
              <span>{saving ? 'Saving…' : isEdit ? 'Update Application' : 'Save Application'}</span>
            </button>

            <button
              type='button'
              onClick={handleClear}
              className='px-4 py-3 rounded-xl text-sm font-medium text-gray-500 transition hover:text-gray-800 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200 cursor-pointer'
            >
              {isEdit ? 'Reset' : 'Clear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const ApplicationForm = (props) => {
  const updateObject = useSelector((state) => state.app.updateObject);

  return (
    <ApplicationFormInner
      key={updateObject?.id ?? 'new'}   // remounts the form when the target changes
      application={updateObject}
      {...props}
    />
  );
};

export default ApplicationForm;