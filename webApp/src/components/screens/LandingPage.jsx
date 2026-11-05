import React from 'react'

import HeaderBar from '../pages/landingPage/HeaderBar'
import Hero from '../pages/landingPage/Hero'
import Inspiration from '../pages/landingPage/Inspiration'
import Disciplines from '../pages/landingPage/Disciplines'

const LandingPage = () => {
  return (
    <div className='landing-page-container'>
        <HeaderBar/>
        <Hero/>
        <Inspiration/>
        <Disciplines/>
    </div>
  )
}

export default LandingPage