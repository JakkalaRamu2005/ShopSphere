import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import './phonelogin.css';

function PhoneLogin() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [msg, setMsg] = useState('');
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();
    const { setIsLoggedIn } = useAuth();

    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleSendOtp = async (e) => {
        if (e) e.preventDefault();
        if (phoneNumber.length !== 10) {
            setError('Please enter a valid 10-digit phone number');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber })
            });
            const data = await response.json();

            if (data.success) {
                setStep(2);
                setTimer(60);
                setMsg('OTP sent successfully to your phone');
            } else {
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus next
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, otp: otpString })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                navigate('/');
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Phone Login</h2>

            {step === 1 ? (
                <form onSubmit={handleSendOtp} className="login-form">
                    <div className="form-group">
                        <label>Phone Number</label>
                        <div className="phone-input-wrapper">
                            <span className="country-code">+91</span>
                            <input
                                type="tel"
                                placeholder="Enter 10 digit number"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').substring(0, 10))}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Get OTP'}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleVerifyOtp} className="login-form">
                    <div className="form-group">
                        <label>Enter 6-Digit OTP</label>
                        <div className="otp-input-container">
                            {otp.map((digit, idx) => (
                                <input
                                    key={idx}
                                    id={`otp-${idx}`}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(idx, e)}
                                    className="otp-box"
                                />
                            ))}
                        </div>
                        <p className="timer-text">
                            {timer > 0 ? (
                                `Valid for 00:${timer.toString().padStart(2, '0')}`
                            ) : (
                                <span className="resend-link" onClick={handleSendOtp}>Resend OTP</span>
                            )}
                        </p>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify & Login'}
                    </button>

                    <button
                        type="button"
                        className="back-btn"
                        onClick={() => setStep(1)}
                        style={{ background: 'none', color: '#666', border: 'none', boxShadow: 'none', marginTop: '10px' }}
                    >
                        Change Phone Number
                    </button>
                </form>
            )}

            {error && <p className="message error">{error}</p>}
            {msg && !error && <p className="message success">{msg}</p>}

            <p className="redirect-text">
                Want to login via email? <Link to="/login">Click here</Link>
            </p>
        </div>
    );
}

export default PhoneLogin;
