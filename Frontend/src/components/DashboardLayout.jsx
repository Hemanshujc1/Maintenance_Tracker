import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import '../App.css';

const DashboardLayout = () => {
    return (
        <div className="dashboard-container">
            <Navbar />
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
