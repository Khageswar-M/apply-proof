import React from 'react'

import HeaderBar from '../pages/landingPage/HeaderBar'
import Hero from '../pages/landingPage/Hero'
import Inspiration from '../pages/landingPage/Inspiration'

const LandingPage = () => {
  return (
    <div className='landing-page-container'>
        <HeaderBar/>
        <Hero/>
        <Inspiration/>
    </div>
  )
}

export default LandingPage