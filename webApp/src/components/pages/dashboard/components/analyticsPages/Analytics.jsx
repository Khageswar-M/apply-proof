import React from 'react'
import Title from './chunks/Title'
import Stats from './chunks/Stats'

const Analytics = () => {
  return (
    <div className='flex flex-col gap-5 h-full'>
        <Title/>
        <Stats/>
    </div>
  )
}

export default Analytics