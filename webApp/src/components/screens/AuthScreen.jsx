
import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSucceeded } from '../redux/appSlice';
import authService from '../../services/authService';

const OTP_LENGTH = 6;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyOtp = () => Array(OTP_LENGTH).fill('');

/**
 * Converts API errors into messages that ordinary users can understand.
 * The message explains:
 * 1. What happened.
 * 2. Why it may have happened.
 * 3. What the user should do next.
 */
const getFriendlyError = (result, action) => {
    const status = result?.status;
    const code = result?.error?.code;
    const serverMessage = result?.message?.toLowerCase() || '';

    if (code === 'TIMEOUT') {
        return 'The server took too long to respond. Your internet connection may be slow, or the server may be busy. Please try again.';
    }

    if (code === 'NETWORK_ERROR') {
        return 'We could not reach the server. Please check your internet connection and try again. If your connection is working, the application server may be temporarily unavailable.';
    }

    if (status === 400) {
        if (serverMessage.includes('invalid otp')) {
            return 'The verification code you entered is incorrect or has expired. Please check your email and enter the latest code.';
        }

        return result.message
            ? `Your request could not be accepted: ${result.message}. Please check your information and try again.`
            : 'Some of the information you submitted is incorrect or incomplete. Please check it and try again.';
    }

    if (status === 401) {
        return 'Your authentication could not be verified. Your verification code or login session may have expired. Please start again.';
    }

    if (status === 403) {
        return 'The server understood your request but did not allow it. You may not have permission to perform this action. Please contact support if this continues.';
    }

    if (status === 404) {
        return 'The requested service could not be found. The application endpoint may be unavailable or incorrectly configured. Please try again later.';
    }

    if (status === 409) {
        return action === 'signup'
            ? 'An account with this email address may already exist. Please switch to Log In and try again.'
            : 'This request conflicts with an existing account or verification request. Please try again.';
    }

    if (status === 429) {
        return 'Too many requests have been made in a short time. Please wait a while before trying again.';
    }

    if (status >= 500) {
        return 'Something went wrong on our server while processing your request. Your information has not been confirmed. Please try again later.';
    }

    return result?.message
        ? `We could not complete your request: ${result.message}. Please try again.`
        : 'An unexpected problem occurred. Please try again. If the problem continues, contact support.';
};

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
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [mode, setMode] = useState('login');
    const [step, setStep] = useState('email');

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [apiError, setApiError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [logoutWarning, setLogoutWarning] = useState(location.state?.logoutWarning ?? '');

    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(emptyOtp());

    const otpRefs = useRef([]);

    const isLogin = mode === 'login';
    const otpComplete = otp.every(Boolean);

    // Reset the form whenever the user switches authentication mode.
    const switchMode = (nextMode) => {
        if (loading) return;

        setMode(nextMode);
        setStep('email');
        setEmailError('');
        setApiError('');
        setLogoutWarning('');
        setSuccessMessage('');
        setOtp(emptyOtp());
    };

    /**
     * STEP 1:
     * Validate email and request an OTP.
     */
    const handleSendCode = async (e) => {
        e.preventDefault();

        if (loading) return;

        const value = email.trim();

        if (!EMAIL_REGEX.test(value)) {
            setEmailError(
                'Please enter a valid email address, such as user@example.com.'
            );
            return;
        }

        setEmailError('');
        setApiError('');
        setSuccessMessage('');
        setEmail(value);
        setLoading(true);

        try {
            const res = await authService.sendOtp(value);

            if (!res.success) {
                setEmailError(
                    getFriendlyError(res, 'send-otp')
                );
                return;
            }

            setStep('verify');
            setOtp(emptyOtp());

            setTimeout(() => {
                otpRefs.current[0]?.focus();
            }, 0);

        } catch (error) {
            setEmailError(
                getFriendlyError(
                    {
                        message: error?.message,
                        status: error?.status,
                        error,
                    },
                    'send-otp'
                )
            );
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles individual OTP digit changes.
     */
    const handleOtpChange = (i, raw) => {
        const digit = raw.replace(/\D/g, '').slice(-1);

        setApiError('');

        setOtp((prev) =>
            prev.map((d, idx) => idx === i ? digit : d)
        );

        if (digit && i < OTP_LENGTH - 1) {
            otpRefs.current[i + 1]?.focus();
        }
    };

    /**
     * Handles backspace navigation.
     */
    const handleOtpKeyDown = (i, e) => {
        if (
            e.key === 'Backspace' &&
            !otp[i] &&
            i > 0
        ) {
            otpRefs.current[i - 1]?.focus();
        }
    };

    /**
     * Handles pasting a complete OTP.
     */
    const handleOtpPaste = (e) => {
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, OTP_LENGTH);

        if (!pasted) return;

        e.preventDefault();

        setApiError('');

        setOtp(
            Array.from(
                { length: OTP_LENGTH },
                (_, i) => pasted[i] ?? ''
            )
        );

        otpRefs.current[
            Math.min(pasted.length, OTP_LENGTH - 1)
        ]?.focus();
    };

    /**
     * STEP 2:
     * Verify OTP.
     *
     * STEP 3:
     * After registration, return to the login form.
     * A separate login flow then receives authentication cookies.
     */
    const handleVerify = async (e) => {
        e.preventDefault();

        if (!otpComplete || loading) return;

        setApiError('');
        setLoading(true);

        try {

            // Step 1: Verify the OTP.
            const verifyResult = await authService.verifyOtp(
                email,
                otp.join('')
            );

            if (!verifyResult.success) {
                setApiError(
                    getFriendlyError(verifyResult, 'verify-otp')
                );
                return;
            }

            // Create the account, then ask the user to log in separately.
            if (!isLogin) {
                const signupResult = await authService.signUp(email);

                if (!signupResult.success) {
                    setApiError(
                        getFriendlyError(signupResult, 'signup')
                    );
                    return;
                }

                setMode('login');
                setStep('email');
                setOtp(emptyOtp());
                setApiError('');
                setEmailError('');
                setSuccessMessage('Your account was created successfully. Please log in to continue.');
                return;
            }

            // Log in after successful OTP verification.
            const loginResult = await authService.login(email);

            if (!loginResult.success) {
                setApiError(
                    getFriendlyError(loginResult, 'login')
                );

                return;
            }

            // Confirm the profile details needed by the client are present.
            if (!loginResult.data?.userId || !loginResult.data?.email) {
                setApiError(
                    'You were authenticated, but the server did not return your user ID and email. Please contact support before continuing.'
                );
                return;
            }

            try {
                localStorage.setItem('userId', loginResult.data.userId);
                localStorage.setItem('email', loginResult.data.email);
            } catch {
                setApiError('Login succeeded, but this browser could not save your user details. Check your browser storage settings and try again.');
                return;
            }

            setOtp(emptyOtp());
            onAuthSuccess?.(loginResult.data);
            dispatch(loginSucceeded({
                userId: loginResult.data.userId,
                email: loginResult.data.email,
            }));
            navigate('/dashboard', { replace: true });

        } catch (error) {

            setApiError(
                getFriendlyError(
                    {
                        message: error?.message,
                        status: error?.status,
                        error,
                    },
                    'authentication'
                )
            );

        } finally {
            setLoading(false);
        }
    };

    /**
     * Allows the user to return to the email screen.
     */
    const handleChangeEmail = () => {
        if (loading) return;

        setStep('email');
        setApiError('');
        setEmailError('');
        setSuccessMessage('');
        setOtp(emptyOtp());
    };

    return (
        <div className="auth-screen-container">
            <div className="auth-screen-section-container">
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
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setSuccessMessage('');
                                            }}
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
                                        {successMessage && (
                                            <span role="status">{successMessage}</span>
                                        )}
                                        {logoutWarning && (
                                            <span role="status">{logoutWarning}</span>
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
