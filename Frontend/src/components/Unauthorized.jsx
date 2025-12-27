import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Unauthorized = () => {
    return (
        <div className="login-container">
            <div className="login-card" style={{ textAlign: 'center' }}>
                <h2 className="login-title" style={{ color: '#ef4444' }}>Access Denied</h2>
                <p className="login-subtitle">You do not have permission to view this page.</p>
                <div className="login-links" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                    <Link to="/login" className="signup-link">Return to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
