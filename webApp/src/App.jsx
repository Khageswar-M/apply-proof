import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import LandingPage from './components/screens/LandingPageScreen'
import AuthScreen from './components/screens/AuthScreen'
import ApplicationsScreen from './components/screens/ApplicationsScreen'
import { restoreSession } from './components/redux/appSlice'

import Dashboard from './components/pages/dashboard/components/dashboardPages/Dashboard'
import Applications from './components/pages/dashboard/components/applicationsPages/Applications'
import AddApplication from './components/pages/dashboard/components/addApplication/AddApplication'
import Analytics from './components/pages/dashboard/components/analyticsPages/Analytics'
import Settings from './components/pages/dashboard/components/settingsPages/Settings'

const RequireAuth = () => {
  const authStatus = useSelector((state) => state.app.authStatus)

  if (authStatus === 'checking') {
    return <div role='status'>Checking your session...</div>
  }

  if (authStatus !== 'authenticated') {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

const AppRoutes = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(restoreSession())
  }, [dispatch])

  return (
    <div className='app-container'>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<AuthScreen />} />

        <Route element={<RequireAuth />}>
          <Route element={<ApplicationsScreen />}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/applications' element={<Applications />} />
            <Route path='/add-application' element={<AddApplication />} />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/settings' element={<Settings />} />
          </Route>
        </Route>

        <Route path='*' element={<Navigate to='/dashboard' replace />} />
      </Routes>
    </div>
  )
}

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
)

export default App