import React from 'react'
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    return (
        <div className='flex flex-row items-center justify-between'>
            <div className='flex flex-col gap-1'>
                <p className='text-xl font-bold'>Good morning, Khageswar</p>
                <p className='text-sm text-neutral-700'>Here is your job hunt momentum for today.</p>
            </div>


            <div className='dash-head-right'>
                <div className='flex flex-row items-center text-xs p-2 gap-2'>
                    <button className='bg-white active:bg-neutral-100'> <span class="material-symbols-outlined !text-sm">tune</span> Filter View</button>
                    <button onClick={() => navigate("/add-application")} className='bg-primary-700 active:bg-primary-600 text-white'> <span class="material-symbols-outlined !text-sm">add</span>Add Application</button>
                </div>
            </div>
        </div>
    )
}

export default Header;