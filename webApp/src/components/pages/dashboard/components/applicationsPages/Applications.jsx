import React from 'react'
import Head from './chunks/Head';
import Search from './chunks/Search';
import Filters from './chunks/Filters';
import ApplicationCards from './chunks/ApplicationCards';

const Applications = () => {
  return (
    <div className='flex flex-col gap-5'>
      <Head/>
      <Search/>
      <Filters/>
      <ApplicationCards/>
    </div>
  )
}

export default Applications;