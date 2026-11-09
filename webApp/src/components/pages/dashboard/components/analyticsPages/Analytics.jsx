import React, { useMemo } from 'react'
import Title from './chunks/Title'
import Stats from './chunks/Stats'
import StatusBreakDown from './chunks/StatusBreakDown'
import ResumePerformance from './chunks/ResumePerformance'
import { makeDummyApplications } from '../../../../utils/dummyApplications'

const Analytics = () => {
    const applications = useMemo(makeDummyApplications, []);
    return (
        <div className='flex flex-col gap-5 h-full'>
            <Title />
            <Stats applications={applications} />

            <div className='grid w-full grid-cols-1 gap-5 lg:grid-cols-2 pb-5'>
                <section className='flex min-w-0 flex-col rounded-md bg-white p-5 shadow'>
                    <StatusBreakDown />
                </section>

                <section className='flex min-w-0 flex-col rounded-md bg-white p-5 shadow'>
                    <ResumePerformance />
                </section>
            </div>
        </div>
    )
}

export default Analytics