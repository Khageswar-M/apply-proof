import { useRef, useState } from 'react';
import { sendOtp, verifyOtp, signUp, login } from '../../services/authService';

const OTP_LENGTH = 6; 
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const emptyOtp = () => Array(OTP_LENGTH).fill('');

const FEATURES = [
    {
        iconName: 'lock',
        title: 'Zero Password Fatigue',
        desc: 'Instant 6-digit access codes delivered straight to your inbox.',
    },
    {
        iconName: 'shield',
        title: 'Client-Side Sovereignty',
        desc: 'Your job applications and proof tokens stay strictly on your device.',
    },
    {
        iconName: 'order_approve',
        title: 'Verifiable Proof Chain',
        desc: 'Timestamped records verify submission proofs without cloud tracking.',
    },
];

const AuthScreen = ({ onAuthSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login' | 'signup'
    const [step, setStep] = useState('email'); // 'email' | 'verify'
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(emptyOtp());
    const otpRefs = useRef([]);

    const isLogin = mode === 'login';
    const otpComplete = otp.every(Boolean);

    const switchMode = (nextMode) => {
        setMode(nextMode);
        setStep('email');
        setEmailError('');
        setApiError('');
        setOtp(emptyOtp());
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        if (loading) return;
        const value = email.trim();

        if (!EMAIL_REGEX.test(value)) {
            setEmailError('Enter a valid email address.');
            return;
        }

        setEmailError('');
        setApiError('');
        setEmail(value);
        setLoading(true);

        const res = await sendOtp(value);

        setLoading(false);
        if (!res.success) {
            setEmailError(res.message);
            return;
        }
        setStep('verify');
        setTimeout(() => otpRefs.current[0]?.focus(), 0);
    };

    const handleOtpChange = (i, raw) => {
        const digit = raw.replace(/\D/g, '').slice(-1);
        setOtp((prev) => prev.map((d, idx) => (idx === i ? digit : d)));
        if (digit && i < OTP_LENGTH - 1) otpRefs.current[i + 1]?.focus();
    };

    const handleOtpKeyDown = (i, e) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) {
            otpRefs.current[i - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        if (!pasted) return;
        e.preventDefault();
        setOtp(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] ?? ''));
        otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!otpComplete || loading) return;

        setApiError('');
        setLoading(true);
        console.log("Email: ", email," OTP: ", otp.join(''));
        let res = await verifyOtp(email, otp.join(''));
        console.log("res: ", res);
        if (res.success && !isLogin) res = await signUp(email); // sign-up returns no tokens...
        if (res.success) res = await login(email); // ...so log in right after; cookies get set here

        setLoading(false);
        if (!res.success) {
            setApiError(res.message);
            setOtp(emptyOtp());
            setTimeout(() => otpRefs.current[0]?.focus(), 0);
            return;
        }
        onAuthSuccess?.(res.data);
    };

    const handleChangeEmail = () => {
        setStep('email');
        setApiError('');
        setOtp(emptyOtp());
    };

    return (
        <div className="auth-screen-container">
            <div className="auth-screen-section-container">
                {/* Left: branding */}
                <section className="auth-screen-section auth-screen-section-container-left-section">
                    <div>
                        <div>
                            <span className="material-symbols-outlined">verified</span>
                        </div>
                        <div>
                            <p>ApplyProof</p>
                            <p>PRIVATE JOB LEDGER</p>
                        </div>
                    </div>

                    <div>
                        <p>Never lose track of where you applied.</p>
                        <p>
                            A cryptographically attested, distraction-free application journal.
                            Sign in seamlessly with passwordless email authentication.
                        </p>
                    </div>

                    <div>
                        {FEATURES.map(({ iconName, title, desc }) => (
                            <div className="list" key={title}>
                                <div className="list-icon">
                                    <span className="material-symbols-outlined">{iconName}</span>
                                </div>
                                <div className="list-meta">
                                    <p>{title}</p>
                                    <p>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Right: auth form */}
                <section className="auth-screen-section auth-screen-section-container-right-section">
                    <div>
                        <div>
                            <div>
                                <p>Access your Journal</p>
                                <p>Log in or register via secure email OTP</p>
                            </div>

                            <div role="tablist" aria-label="Authentication mode">
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={isLogin}
                                    className={isLogin ? 'auth-btn-active' : 'text-neutral-400'}
                                    onClick={() => switchMode('login')}
                                    disabled={loading}
                                >
                                    Log In
                                </button>
                                <button
                                    type="button"
                                    role="tab"
                                    aria-selected={!isLogin}
                                    className={!isLogin ? 'auth-btn-active' : 'text-neutral-400'}
                                    onClick={() => switchMode('signup')}
                                    disabled={loading}
                                >
                                    Sign Up
                                </button>
                            </div>
                        </div>

                        {step === 'email' ? (
                            <form className="email-wrap" onSubmit={handleSendCode} noValidate>
                                <div className="email-container">
                                    <div className="email-box">
                                        <label htmlFor="auth-email">Email Address</label>
                                        <input
                                            id="auth-email"
                                            type="email"
                                            autoComplete="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            aria-invalid={Boolean(emailError)}
                                            aria-describedby={emailError ? 'auth-email-error' : undefined}
                                            disabled={loading}
                                            required
                                        />
                                        {emailError && (
                                            <span id="auth-email-error" role="alert">
                                                {emailError}
                                            </span>
                                        )}
                                    </div>
                                    <span>
                                        We will send a 6-digit cryptographic verification code to this address.
                                    </span>
                                </div>

                                <button type="submit" disabled={loading}>
                                    <span className="material-symbols-outlined !text-lg">
                                        forward_to_inbox
                                    </span>
                                    {loading ? 'Sending...' : 'Send verification code'}
                                </button>
                            </form>
                        ) : (
                            <form className="verification-wrapper" onSubmit={handleVerify}>
                                <span>Email verification</span>
                                <div>
                                    Code sent to {email}{' '}
                                    <button type="button" onClick={handleChangeEmail} disabled={loading}>
                                        Change
                                    </button>
                                </div>

                                <div>
                                    <span>Enter 6 Digit Code</span>
                                    <span>{otpComplete ? 'Ready to verify' : 'Waiting for code'}</span>
                                </div>

                                <div onPaste={handleOtpPaste}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => (otpRefs.current[i] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete={i === 0 ? 'one-time-code' : 'off'}
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                            aria-label={`Digit ${i + 1} of ${OTP_LENGTH}`}
                                            disabled={loading}
                                        />
                                    ))}
                                </div>

                                {apiError && <span role="alert">{apiError}</span>}

                                <button type="submit" disabled={!otpComplete || loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>
                        )}
                    </div>

                    <div className="right-section-bottom-container">
                        <hr />
                        <p>
                            <span>100% Client-Side privacy: </span>
                            <span>
                                Your cryptographic key is derived locally. Your credentials and job
                                ledger never leave your device unencrypted.
                            </span>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AuthScreen;