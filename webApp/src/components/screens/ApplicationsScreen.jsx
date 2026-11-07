import AsidePage from '../pages/dashboard/AsidePage';
import MainPage from '../pages/dashboard/MainPage';

const ApplicationsScreen = () => {
  return (
    <div className='application-container'>
      <section className='app-left-section'>
        <AsidePage/>
      </section>

      <section className='app-right-section'>
        <MainPage/>
      </section>
    </div>
  )
}

export default ApplicationsScreen;