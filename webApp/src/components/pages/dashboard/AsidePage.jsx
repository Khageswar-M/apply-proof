import React, { useState } from 'react'

const TABS = [
    {
        id: 1,
        title: "Dashboard"
    },
    {
        id: 2,
        title: "Applications"
    },
    {
        id: 3,
        title: "Add Application"
    },
    {
        id: 4,
        title: "Analytics"
    },
    {
        id: 5,
        title: "Settings"
    }
]

const AsidePage = () => {

    const [activeTab, setActiveTab] = useState(1);

    return (
        <div className='aside-container'>
            <div className='aside-wrapper'>
                <div className='aside-title'>
                    <p>ApplyProof</p>
                </div>

                <ul className='aside-tabs'>
                    {
                        TABS.map((tab) => (
                            <li 
                                id={tab.id} 
                                className={activeTab === tab.id ? 'aside-tabs-active' : ''}
                                onClick={() => setActiveTab(tab.id)}
                            >{tab.title}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default AsidePage