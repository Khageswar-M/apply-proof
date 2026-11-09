import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import LandingPage from './components/screens/LandingPageScreen'
import AuthScreen from './components/screens/AuthScreen'
import ApplicationsScreen from './components/screens/ApplicationsScreen'

import Dashboard from './components/pages/dashboard/components/dashboardPages/Dashboard'
import Applications from './components/pages/dashboard/components/applicationsPages/Applications'
import AddApplication from './components/pages/dashboard/components/addApplication/AddApplication'
import Analytics from './components/pages/dashboard/components/analyticsPages/Analytics'
import Settings from './components/pages/dashboard/components/settingsPages/Settings'

const App = () => {
  return (
    <BrowserRouter>
      <div className='app-container'>
        <Routes>
          <Route path='/' element={<LandingPage />} />
           <Route path='/login' element={<AuthScreen />} />

          {/* layout route: sidebar + main page, children render in <Outlet /> */}
          <Route element={<ApplicationsScreen/>}>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/applications' element={<Applications />} />
            <Route path='/add-application' element={<AddApplication />} />
            <Route path='/analytics' element={<Analytics />} />
            <Route path='/settings' element={<Settings />} />
          </Route>

          {/* anything else goes to the dashboard for now */}
          <Route path='*' element={<Navigate to='/dashboard' replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App