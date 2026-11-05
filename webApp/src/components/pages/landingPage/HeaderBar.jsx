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
                        <li>Feature</li>
                        <li>How it works</li>
                        <li>Privacy Manifesto</li>
                    </ul>
                </div>



                <div className='header-button-container'>
                    <button className='header-login-btn'>Log in</button>
                    <button className="header-signup-btn">
                        Sign up
                        <span className="material-symbols-outlined !text-sm">
                            arrow_forward
                        </span>
                    </button>
                </div>


            </div>
        </div>
    )
}

export default HeaderBar