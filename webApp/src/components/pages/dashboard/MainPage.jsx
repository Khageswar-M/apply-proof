import React from 'react'
import Dashboard from './components/dashboardPages/Dashboard'
import Applications from './components/applicationsPages/Applications'
const MainPage = () => {
  return (
    <div className='main-page-container'>
        {/* <Dashboard/> */}
        <Applications/>
    </div>
  )
}

export default MainPage