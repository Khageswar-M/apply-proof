import React, { lazy, Suspense } from 'react'

const HeaderBar = lazy(() => import('../pages/landingPage/HeaderBar'));
const Hero = lazy(() => import('../pages/landingPage/Hero'));
const Inspiration = lazy(() => import('../pages/landingPage/Inspiration'));
const Disciplines = lazy(() => import('../pages/landingPage/Disciplines'));
const FooterBar = lazy(() => import('../pages/landingPage/FooterBar'));

const LandingPage = () => {
  return (
    <div className='landing-page-container'>
        <Suspense fallback={<div>Loading...</div>}>
            <HeaderBar />
            <Hero />
            <Inspiration />
            <Disciplines />
            <FooterBar />
        </Suspense>
    </div>
  )
}

export default LandingPage