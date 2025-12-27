import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for future API integration
        console.log('Reset password for:', email);
        setSubmitted(true);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Reset Password</h2>
                <p className="login-subtitle">Enter your email to receive reset instructions</p>

                {submitted ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ color: '#166534', marginBottom: '1.5rem' }}>
                            If an account exists for <strong>{email}</strong>, you will receive reset instructions shortly.
                        </p>
                        <Link to="/login" className="signin-btn" style={{ display: 'inline-block', textDecoration: 'none', textAlign: 'center' }}>
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <button type="submit" className="signin-btn">Send Reset Link</button>

                        <div className="login-links" style={{ justifyContent: 'center' }}>
                            <Link to="/login" className="signup-link">Back to Login</Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
