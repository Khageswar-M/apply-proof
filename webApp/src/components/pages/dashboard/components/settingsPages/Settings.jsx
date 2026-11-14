import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../../../../services/authService'
import { logoutSucceeded } from '../../../../redux/appSlice'
import Title from './chunks/Title'

const Settings = () => {
    const [loggingOut, setLoggingOut] = useState(false)
    const [logoutError, setLogoutError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const email = useSelector((state) => state.app.currentUser?.email ?? '')

    const handleLogout = async () => {
        if (loggingOut) return

        setLogoutError('')
        setLoggingOut(true)

        try {
            const result = await authService.logout()

            if (!result.success || result.data !== true) {
                setLogoutError(result.message || 'Could not log out. Please try again.')
                return
            }

            dispatch(logoutSucceeded())

            let logoutWarning = ''
            try {
                localStorage.removeItem('userId')
                localStorage.removeItem('email')
            } catch {
                logoutWarning = 'You are logged out, but this browser could not clear the saved profile details.'
            }

            navigate('/login', {
                replace: true,
                state: logoutWarning ? { logoutWarning } : null,
            })
        } catch (error) {
            setLogoutError(error?.message || 'Could not log out. Please try again.')
        } finally {
            setLoggingOut(false)
        }
    }

    return (
        <div className='flex flex-col gap-5 h-full'>
            <Title />

            <div className='h-full w-full flex flex-row items-center justify-center'>

                <section className='w-full max-w-xl rounded-md bg-white p-5 shadow'>
                    <p className='flex flex-col'>
                        <span className='text-lg font-bold text-gray-900'>Account</span>
                        <span className='text-xs text-neutral-500'>Manage how you’re signed in to ApplyProof.</span>
                    </p>

                    <div className='mt-5 flex items-center gap-3 rounded-xl border border-gray-200 p-3'>
                        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-base font-bold text-emerald-800'>
                            {email[0]?.toUpperCase() ?? '?'}
                        </div>

                        <div className='min-w-0'>
                            <p className='text-xs text-neutral-500'>Signed in as</p>
                            <p className='truncate text-sm font-medium text-gray-900' title={email}>
                                {email}
                            </p>
                        </div>
                    </div>

                    <div className='mt-5 flex items-center justify-between gap-4 border-t border-gray-100 pt-5'>
                        <p className='text-sm text-neutral-500'>
                            Log out of this device. Your data stays saved.
                        </p>

                        <button
                            type='button'
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className='flex shrink-0 items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
                        >
                            <span className='material-symbols-outlined text-[20px]'>logout</span>
                            {loggingOut ? 'Logging out…' : 'Log out'}
                        </button>
                    </div>
                    {logoutError && (
                        <p className='mt-3 text-sm text-red-600' role='alert'>
                            {logoutError}
                        </p>
                    )}
                </section>

            </div>

        </div>
    )
}

export default Settings