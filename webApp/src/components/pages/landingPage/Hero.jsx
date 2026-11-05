import React from 'react'
import { CardData, POSITIONS } from '../../constants/ConstantDate'

const Hero = () => {
    const CARD_COUNT = 7;
    return (
        <div className='hero-container'>


            <section className='section-one'>
                <div className='top-line'>EDITORIAL JOB SEARCH COMPANION</div>

                <div className='hero-title'>Remember every job you applied to.</div>

                <div className='hero-title-description'>A quit, zero-cloud job tracker for engineers and designers. Your receipts, notes, and metrics remain strictly client-side.</div>

                <div className='section-one-btn-container'>
                    <button className='hero-sOne-btnOne'>Start your ledger</button>
                    <button className='hero-sOne-btnTwo'>Sign in</button>
                </div>

                <div className='bottom-line'>
                    <span class="material-symbols-outlined !text-sm">task_alt</span>
                    100% data secure and protected.</div>
            </section>


            <section className="section-two">
                {/* Floating Cards */}
                <div className="hero-sTwo-cards-container">
                    {POSITIONS.map((pos, index) => (
                        <div
                            key={index}
                            className="hero-sTwo-card"
                            style={{ top: pos.top, left: pos.left, rotate: pos.rotate }}
                        >
                            <div className="hero-sTwo-card-header">
                                <span>{CardData.heading}</span>
                                <span
                                    className={`${CardData.status["bg-color"]} ${CardData.status["text-color"]} hero-sTwo-status`}
                                >
                                    {CardData.status.title}
                                </span>
                            </div>

                            <div className="hero-sTwo-card-description">{CardData.description}</div>

                            <hr />

                            <div className="hero-sTwo-card-footer">
                                <span>{CardData["btm-left-text"]}</span>
                                <span>{CardData["btm-right-text"]}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Person Illustration (exact center) */}
                <div className="hero-sTwo-person-container">
                    <img
                        className="hero-sTwo-PersonIcon"
                        src="/icons/person-with-laptop.png"
                        alt="Person with laptop"
                    />
                </div>
            </section>


        </div>
    )
}

export default Hero