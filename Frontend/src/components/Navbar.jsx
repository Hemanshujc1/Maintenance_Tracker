import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="dashboard-nav">
            <h1>Maintenance Tracker</h1>
            
            <div className="nav-links-container">
                {['Admin', 'Manager'].includes(user?.role) && (
                    <Link 
                        to="/dashboard" 
                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        Users
                    </Link>
                )}
                
                <Link 
                    to="/equipment" 
                    className={`nav-item ${isActive('/equipment') || location.pathname.startsWith('/equipment') ? 'active' : ''}`}
                >
                    Equipment
                </Link>
            </div>

            <div className="user-info">
                <span>{user?.first_name || user?.name} ({user?.role})</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
