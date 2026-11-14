import { Outlet } from 'react-router-dom'

const MainPage = () => {
  return (
    <div className='main-page-container'>
        <Outlet/>
    </div>
  )
}

export default MainPage