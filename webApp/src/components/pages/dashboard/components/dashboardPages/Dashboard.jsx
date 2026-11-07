import React from 'react'
import Header from './chunks/Header'
import ApplyCountCharts from './chunks/ApplyCountCharts'
const Dashboard = () => {
  return (
    <div className='dash-board-container'>
      <Header/>
      <ApplyCountCharts/>
    </div>
  )
}

export default Dashboard