import React from 'react'
import { NavLink } from 'react-router-dom'

const TABS = [
  { path: '/dashboard',       title: 'Dashboard',       icon: 'dashboard' },
  { path: '/applications',    title: 'Applications',    icon: 'work' },
  { path: '/add-application', title: 'Add Application', icon: 'add_circle' },
  { path: '/analytics',       title: 'Analytics',       icon: 'monitoring' },
  { path: '/settings',        title: 'Settings',        icon: 'settings' },
]

const AsidePage = ({ email = 'khageswarmaharana462@gmail.com' }) => {
  return (
    <aside className='flex h-full shrink-0 flex-col justify-between border-r border-gray-200 bg-white p-4'>
      <div className='flex flex-col gap-6'>
        {/* Brand */}
        <div className='flex items-center gap-2 px-2'>
          <span className='material-symbols-outlined text-[26px] text-emerald-600'>
            verified_user
          </span>
          <p className='text-lg font-bold text-gray-900'>ApplyProof</p>
        </div>

        {/* Tabs */}
        <nav>
          <ul className='flex flex-col gap-1'>
            {TABS.map(({ path, title, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition cursor-pointer
                    focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100
                    ${isActive
                      ? 'bg-emerald-600 font-semibold text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`
                  }
                >
                  <span className='material-symbols-outlined !text-sm'>{icon}</span>
                  {title}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Profile */}
      <div className='flex items-center gap-3 rounded-xl border border-gray-200 p-2.5'>
        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-800'>
          {email[0].toUpperCase()}
        </div>
        <p className='min-w-0 truncate text-xs text-gray-600' title={email}>
          {email}
        </p>
      </div>
    </aside>
  )
}

export default AsidePage