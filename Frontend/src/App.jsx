import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import SignUp from './components/SignUp';
import EquipmentList from './pages/EquipmentList';
import EquipmentForm from './pages/EquipmentForm';
import RequestList from './pages/RequestList';
import './App.css';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const [currentForm, setCurrentForm] = useState('login');

    const toggleForm = (formName) => {
        setCurrentForm(formName);
    };

    // Mocking auth status for now to allow access to equipment routes without full auth implementation
    // In a real scenario, this would check the AuthContext
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        <Route path="/login" element={<Login onSwitchToSignUp={() => toggleForm('signup')} />} />
                        <Route path="/signup" element={<SignUp onSwitchToLogin={() => toggleForm('login')} />} />

                        {/* Protected Routes */}
                        <Route path="/" element={
                            isAuthenticated ? (
                                <div className="dashboard">
                                    <nav className="navbar">
                                        <Link to="/" className="nav-brand">Maintenance Tracker</Link>
                                        <div className="nav-links">
                                            <Link to="/equipment">Equipment</Link>
                                            <Link to="/requests">Requests</Link>
                                        </div>
                                        <button onClick={() => {
                                            localStorage.removeItem('token');
                                            window.location.href = '/login';
                                        }} className="btn btn-secondary">Logout</button>
                                    </nav>
                                    <div className="home"><h1>Welcome to Maintenance Tracker</h1><Link to="/equipment">Manage Equipment</Link></div>
                                </div>
                            ) : <Navigate to="/login" />
                        } />

                        <Route path="/equipment" element={
                            isAuthenticated ? (
                                <div className="dashboard">
                                    <nav className="navbar">
                                        <Link to="/" className="nav-brand">Maintenance Tracker</Link>
                                        <div className="nav-links">
                                            <Link to="/equipment">Equipment</Link>
                                            <Link to="/requests">Requests</Link>
                                        </div>
                                        <button onClick={() => {
                                            localStorage.removeItem('token');
                                            window.location.href = '/login';
                                        }} className="btn btn-secondary">Logout</button>
                                    </nav>
                                    <main className="main-content">
                                        <EquipmentList />
                                    </main>
                                </div>
                            ) : <Navigate to="/login" />
                        } />

                        <Route path="/requests" element={
                            isAuthenticated ? (
                                <div className="dashboard">
                                    <nav className="navbar">
                                        <Link to="/" className="nav-brand">Maintenance Tracker</Link>
                                        <div className="nav-links">
                                            <Link to="/equipment">Equipment</Link>
                                            <Link to="/requests">Requests</Link>
                                        </div>
                                        <button onClick={() => {
                                            localStorage.removeItem('token');
                                            window.location.href = '/login';
                                        }} className="btn btn-secondary">Logout</button>
                                    </nav>
                                    <main className="main-content">
                                        <RequestList />
                                    </main>
                                </div>
                            ) : <Navigate to="/login" />
                        } />

                        <Route path="/equipment/new" element={
                            isAuthenticated ? (
                                <div className="dashboard">
                                    <nav className="navbar">
                                        <Link to="/" className="nav-brand">Maintenance Tracker</Link>
                                        <div className="nav-links">
                                            <Link to="/equipment">Equipment</Link>
                                        </div>
                                    </nav>
                                    <main className="main-content">
                                        <EquipmentForm />
                                    </main>
                                </div>
                            ) : <Navigate to="/login" />
                        } />

                        <Route path="/equipment/:id" element={
                            isAuthenticated ? (
                                <div className="dashboard">
                                    <nav className="navbar">
                                        <Link to="/" className="nav-brand">Maintenance Tracker</Link>
                                        <div className="nav-links">
                                            <Link to="/equipment">Equipment</Link>
                                        </div>
                                    </nav>
                                    <main className="main-content">
                                        <EquipmentForm />
                                    </main>
                                </div>
                            ) : <Navigate to="/login" />
                        } />

                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
