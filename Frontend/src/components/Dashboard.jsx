import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Dashboard = () => {
    const [users, setUsers] = useState([]);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users');
            setUsers(res.data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/${userId}/role`, { role: newRole });
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Failed to update role', error);
            alert('Failed to update role');
        }
    };

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        try {
            await api.put(`/users/${userId}/status`, { status: newStatus });
            fetchUsers();
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
        <>
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

            <h2>User Management</h2>
            <div className="table-responsive">
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
                                <td>{u.first_name} {u.last_name}</td>
                                <td>{u.email}</td>
                                <td>
                                    <select
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                        className="role-select"
                                        disabled={user.id === u.id || (user.role === 'Manager' && (u.role === 'Admin' || u.role === 'Manager'))}
                                    >
                                        {/* Managers cannot promote to Admin or Manager */}
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
                                    {/* Managers cannot block Admins or other Managers (though RBAC filters them out mostly) */}
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
        </>
    );
};

export default Dashboard;
