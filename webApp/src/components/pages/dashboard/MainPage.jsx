import React from 'react'
import Dashboard from './components/dashboardPages/Dashboard'
import Applications from './components/applicationsPages/Applications'
import AddApplication from './components/addApplication/AddApplication'
import Analytics from './components/analyticsPages/Analytics'
import Settings from './components/settingsPages/Settings'
const MainPage = () => {
  return (
    <div className='main-page-container'>
        {/* <Dashboard/> */}
        {/* <Applications/> */}
        {/* <AddApplication/> */}
        {/* <Analytics/> */}
        <Settings/>
    </div>
  )
}

export default MainPage