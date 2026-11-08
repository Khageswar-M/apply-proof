import React from 'react'
import Header from './chunks/Header'
import ApplyCountCharts from './chunks/ApplyCountCharts'
import Cards from './chunks/Cards'
const Dashboard = () => {
  return (
    <div className='dash-board-container'>
      <Header/>
      <ApplyCountCharts/>
      <Cards/>
    </div>
  )
}

export default Dashboard