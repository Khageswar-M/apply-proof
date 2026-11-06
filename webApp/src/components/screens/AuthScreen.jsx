import SignupPage from '../pages/authScreen/SignupPage'
import LoginPage from '../pages/authScreen/LoginPage'

const LEFT_SECTION_LAST_CHILD_LISTS = [
    {
        iconName: "lock",
        title: "Zero Password Fatigue",
        desc: "Instant 6-digit access codes delivered straight to your inbox."
    },
    {
        iconName: "shield",
        title: "Client-Side Sovereignty",
        desc: "Your job applications and proof tokens stay strictly on your device."
    },
    {
        iconName: "order_approve",
        title: "Verifiable Proof Chain",
        desc: "Timestamped records verify submission proofs without cloud tracking."
    }
];

const AuthScreen = () => {
    return (
        <div className='auth-screen-container'>

            <div className="auth-screen-section-container">

                <section className='auth-screen-section auth-screen-section-container-left-section'>
                    <div>
                        <div>
                            <span className="material-symbols-outlined">
                                verified
                            </span>
                        </div>
                        <div>
                            <p>ApplyProof</p>
                            <p>PRIVATE JOB LEDGER</p>
                        </div>
                    </div>

                    <div>
                        <p>Never lose track of where you applied.</p>
                        <p>A cryptographically attested, distraction-free application journal. Sign in seamlessly with password less email authentication.</p>
                    </div>

                    <div>
                        {
                            LEFT_SECTION_LAST_CHILD_LISTS.map((list) => (
                                <div className='list'>
                                    <div className='list-icon'>
                                        <span class="material-symbols-outlined">{list.iconName}</span>
                                    </div>
                                    <div className='list-meta'>
                                        <p>{list.title}</p>
                                        <p>{list.desc}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </section>



                <section className='auth-screen-section auth-screen-section-container-right-section'>

                </section>
            </div>
        </div>
    )
}

export default AuthScreen