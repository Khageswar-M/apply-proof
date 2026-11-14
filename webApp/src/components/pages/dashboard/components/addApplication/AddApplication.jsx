import React from 'react'
import Title from './chunks/Title'
import ApplicationForm from './chunks/ApplicationForm'

const AddApplication = () => {
  return (
    <div className='flex flex-col gap-5 items-center pb-5'>

        <Title/>
        <ApplicationForm/>
    </div>
  )
}

export default AddApplication