import React from 'react'

const Header = () => {
    return (
        <div className='dash-board-header-container'>
            <div className='dash-head-left'>
                <p>
                    <span>DAILY MOMENTUM OVERVIEW</span>
                    <span>Wednesday, Oct 29</span>
                </p>
                <p>Good morning, Khageswar</p>
                <p>Your intentional career search rhythm is on track.</p>
            </div>


            <div className='dash-head-right'>
                <div>
                    <button>
                        <span class="material-symbols-outlined !text-sm">tune</span> Filter View</button>
                    <button> <span class="material-symbols-outlined !text-sm">add</span>Add Application</button>
                </div>
            </div>
        </div>
    )
}

export default Header