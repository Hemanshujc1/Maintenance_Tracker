import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import api from '../utils/api';
import './ReportsPage.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

const ReportsPage = () => {
    const [teamReport, setTeamReport] = useState([]);
    const [equipReport, setEquipReport] = useState([]);
    const [statusReport, setStatusReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamsRes = await api.get('/reports/teams');
                const equipRes = await api.get('/reports/equipment');
                const statusRes = await api.get('/reports/status');
                
                setTeamReport(teamsRes.data);
                setEquipReport(equipRes.data);
                setStatusReport(statusRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="reports-loading">Loading Reports...</div>;

    return (
        <div className="reports-page-container">
            <h2>Insights & Reports</h2>
            
            <div className="reports-grid">
                {/* Requests per Team */}
                <div className="report-card">
                    <h3>Requests per Maintenance Team</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={teamReport}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="team_name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="request_count" fill="#8884d8" name="Requests" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Requests per Status */}
                <div className="report-card">
                    <h3>Request Status Distribution</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={statusReport}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="request_count"
                                    nameKey="status"
                                >
                                    {statusReport.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Equipment */}
                <div className="report-card full-width">
                    <h3>Top Equipment by Breakdown Frequency</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={equipReport} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="equipment_name" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="request_count" fill="#82ca9d" name="Requests" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;
