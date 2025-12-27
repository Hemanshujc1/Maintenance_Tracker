import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Unauthorized = () => {
    const { logout } = useAuth();

    return (
        <div className="login-container">
            <div className="login-card" style={{ textAlign: 'center' }}>
                <h2 className="login-title" style={{ color: '#ef4444' }}>Access Denied</h2>
                <p className="login-subtitle">You do not have permission to view this page.</p>
                <div className="login-links" style={{ justifyContent: 'center', marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button 
                        onClick={logout} 
                        className="btn-submit" 
                        style={{ width: 'auto', padding: '0.5rem 1rem', background: '#475569' }}
                    >
                        Logout
                    </button>
                    <Link to="/login" className="signup-link" style={{ alignSelf: 'center' }}>Back</Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
