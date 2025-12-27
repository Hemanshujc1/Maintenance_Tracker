import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import '../App.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const [statusReport, setStatusReport] = useState([]);
    const [teamReport, setTeamReport] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [usersRes, statusRes, teamsRes] = await Promise.all([
                api.get('/users'),
                api.get('/reports/status'),
                api.get('/reports/teams')
            ]);
            setUsers(usersRes.data);
            setStatusReport(statusRes.data);
            setTeamReport(teamsRes.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchAllData(); // Refresh list
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update role');
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            await api.put(`/users/${userId}/status`, { status: newStatus });
            fetchAllData();
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Failed to update status');
        }
    };

    if (loading) return <div className="dashboard-container">Loading...</div>;

    // Calculate Stats
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'Active').length;
    const technicians = users.filter(u => u.role === 'Technician').length;
    const employees = users.filter(u => u.role === 'Employee').length;

    return (
        <div style={{ paddingBottom: '40px' }}>
            <div className="dashboard-welcome" style={{ marginBottom: '25px' }}>
                 <h1>Welcome back, {user.first_name} 👋</h1>
                 <p style={{ color: '#64748b' }}>Here's what's happening in your facility today.</p>
            </div>

            <div className="dashboard-stats">
                <div className="stat-card blue">
                    <h3>Total Users</h3>
                    <p>{totalUsers}</p>
                </div>
                <div className="stat-card green">
                    <h3>Active Users</h3>
                    <p>{activeUsers}</p>
                </div>
                <div className="stat-card orange">
                    <h3>Technicians</h3>
                    <p>{technicians}</p>
                </div>
                <div className="stat-card purple">
                    <h3>Employees</h3>
                    <p>{employees}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                <button onClick={() => navigate('/equipment/new')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>+</span> Add Equipment
                </button>
                <button onClick={() => navigate('/calendar')} className="btn-secondary" style={{ background: 'white', border: '1px solid #cbd5e1' }}>
                    📅 View Calendar
                </button>
            </div>

            {/* Charts Section */}
            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div className="chart-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', color: '#334155' }}>Request Status</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={statusReport}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="request_count"
                                >
                                    {statusReport.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="chart-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginBottom: '20px', color: '#334155' }}>Team Workload</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={teamReport}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="team_name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                                <Bar dataKey="request_count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <h2>User Management</h2>
            <div className="table-responsive" style={{ background: 'white', borderRadius: '12px', padding: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>
                                    <div style={{ fontWeight: '500', color: '#334155' }}>{u.first_name} {u.last_name}</div>
                                </td>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="role-select"
                                        disabled={user.id === u.id || (user.role === 'Manager' && (u.role === 'Admin' || u.role === 'Manager'))}
                                    >
                                        {user.role === 'Admin' && <option value="Admin">Admin</option>}
                                        {user.role === 'Admin' && <option value="Manager">Manager</option>}
                                        <option value="Technician">Technician</option>
                                        <option value="Employee">Employee</option>
                                    </select>
                                </td>
                                <td>
                                    <span className={`status-badge ${u.status.toLowerCase()}`}>{u.status}</span>
                                </td>
                                <td>
                                    {user.id !== u.id && (user.role === 'Admin' || (user.role === 'Manager' && u.role !== 'Admin' && u.role !== 'Manager')) && (
                                        <button
                                            onClick={() => handleStatusChange(u.id, u.status)}
                                            className={`action-btn ${u.status === 'Active' ? 'block' : 'activate'}`}
                                        >
                                            {u.status === 'Active' ? 'Block' : 'Activate'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
