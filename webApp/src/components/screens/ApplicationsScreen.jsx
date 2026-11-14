import { useSelector, useDispatch } from 'react-redux';

import {
  Drawer,
  DrawerContent
} from '@/components/ui/drawer'

import AsidePage from '../pages/dashboard/AsidePage'
import MainPage from '../pages/dashboard/MainPage'
import ApplicationForm from '../pages/dashboard/components/addApplication/chunks/ApplicationForm'
import { setUpdateDrawerOpen } from '../redux/appSlice';
const ApplicationsScreen = () => {
  const dispatch = useDispatch();
  const { updateDrawerOpen, setUpdateObject } = useSelector((state) => state.app);

  const handleOpenChange = (isOpen) => {
    dispatch(setUpdateDrawerOpen(isOpen));
    if (!isOpen) dispatch(setUpdateObject(null)); // clear the form data on close
  };

  return (
    <div className='application-container'>
      <section className='app-left-section'>
        <AsidePage />
      </section>

      <section className='app-right-section overflow-y-scroll'>
        <MainPage />
      </section>

      <Drawer
        open={updateDrawerOpen}
        onOpenChange={handleOpenChange}
        showSwipeHandle={false}
        swipeDirection={'right'}
      >
        <DrawerContent>
          {/* <DrawerHeader>
            <DrawerTitle>Works</DrawerTitle>
            <DrawerDescription>Drawer test</DrawerDescription>
          </DrawerHeader> */}

          <div className='flex-1 overflow-y-auto'>
            <ApplicationForm />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

export default ApplicationsScreen