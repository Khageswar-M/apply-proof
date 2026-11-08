import React from 'react'
import Header from './chunks/Header'
import ApplyCountCharts from './chunks/ApplyCountCharts'
import Cards from './chunks/Cards'
import RecentApplicationsTable from './chunks/RecentApplicationsTable'
import StreakCount from './chunks/StreakCount'
const Dashboard = () => {
  return (
    <div className='dash-board-container pb-5'>
      <Header />
      <div className="flex h-[200px] w-full items-stretch gap-5">
        <div className="h-full min-h-0 min-w-0 flex-[0.8]">
          <StreakCount />
        </div>
        <div className="h-full min-h-0 min-w-0 flex-1">
          <ApplyCountCharts />
        </div>
      </div>
      <Cards />
      <RecentApplicationsTable />
    </div>
  )
}

export default Dashboard