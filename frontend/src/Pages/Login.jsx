import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState('login'); // 'login' | 'forgot' | 'reset'

    // Handle login
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            alert("Login successful!");
            localStorage.setItem('token', res.data.token);
        } catch (err) {
            console.error("Login Error:", err);
        }
    };

    // Send OTP
    const handleSendOTP = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/auth/send-otp', { email });
            alert("OTP sent to your email.");
            setStep('reset');
        } catch (err) {
            console.error("OTP Error:", err);
            alert("Email not found or server error.");
        }
    };

    // Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const otpString = otp.join('');
        if (otpString.length < 6) {
            alert("Please enter all 6 digits of the OTP.");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', {
                email,
                otp: otpString,
                password: newPassword,
            });
            alert("Password reset successful!");
            setStep('login');
        } catch (err) {
            console.error("Reset Password Error:", err);
            alert("Invalid OTP or server error.");
        }
    };

    // Handle Google Login
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            localStorage.setItem('token', credentialResponse.credential);
            alert("Google login successful!");
        } catch (err) {
            console.error("Google OAuth error:", err);
        }
    };

    // Handle OTP input change
    const handleOTPChange = (e, index) => {
        const { value } = e.target;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus next box
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    return (
        <div className='body'>

            <div className="container d-flex justify-content-center align-items-center vh-100">
                <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
                    <h3 className="text-center mb-4 text-primary">
                        {step === 'login' ? 'Login' : step === 'forgot' ? 'Forgot Password' : 'Reset Password'}
                    </h3>

                    {/* Login Form */}
                    {step === 'login' && (
                        <form onSubmit={handleLoginSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email address</label>
                                <input type="email" className="form-control" onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })} required placeholder="Enter email" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" onChange={(e) =>
                                    setFormData({ ...formData, password: e.target.value })} required placeholder="Enter password" />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Login</button>
                            <p className="text-center mt-3 text-secondary">
                                Don’t have an account? <a href="/">Register</a>
                            </p>
                            <p className="text-center text-danger mt-2" style={{ cursor: "pointer" }} onClick={() => setStep('forgot')}>
                                Forgot Password?
                            </p>
                        </form>
                    )}

                    {/* Forgot Password */}
                    {step === 'forgot' && (
                        <form onSubmit={handleSendOTP}>
                            <div className="mb-3">
                                <label className="form-label">Enter your registered email</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-warning w-100">Send OTP</button>
                            <p className="text-center mt-2" onClick={() => setStep('login')} style={{ cursor: "pointer", color: "blue" }}>
                                Back to Login
                            </p>
                        </form>
                    )}

                    {/* Reset Password */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword}>
                            <div className="mb-3 text-center">
                                <label className="form-label">Enter OTP</label>
                                <div className="d-flex justify-content-center gap-2">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            className="form-control text-center fw-bold"
                                            style={{ width: '2.5rem', height: '2.5rem', fontSize: '1.2rem' }}
                                            value={digit}
                                            onChange={(e) => handleOTPChange(e, index)}
                                            onKeyDown={(e) => handleKeyDown(e, index)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm New Password</label>
                                <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Reset Password</button>
                            <p className="text-center mt-2" onClick={() => setStep('login')} style={{ cursor: "pointer", color: "blue" }}>
                                Back to Login
                            </p>
                        </form>
                    )}

                    {/* Google Login */}
                    {step === 'login' && (
                        <div className="text-center mt-3">
                            <p className="text-muted">OR</p>
                            <GoogleLogin
                                onSuccess={handleGoogleSuccess}
                                onError={() => console.log('Google Login Failed')}
                                useOneTap
                            />
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

export default Login;
