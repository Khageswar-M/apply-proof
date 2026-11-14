import React from 'react'

const HeaderBar = () => {
    return (
        <div className='header-container'>


            <div className='header-body'>


                <div className='header-icon-container'>
                    ApplyProof
                </div>



                <div className="header-nav-container">
                    <ul className='ul-container'>
                        <li>Pillars</li>
                        <li>Workflow</li>
                        <li>Vault</li>
                    </ul>
                </div>



                <div className='header-button-container'>
                    <button className='header-login-btn'>Log In</button>
                    <button className="header-signup-btn">
                        Get started
                        <span className="material-symbols-outlined !text-sm">
                            arrow_forward
                        </span>
                    </button>
                </div>


            </div>
        </div>
    )
}

export default HeaderBar;