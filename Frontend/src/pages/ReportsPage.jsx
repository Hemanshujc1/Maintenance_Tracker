import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReportsPage = () => {
    const [teamReport, setTeamReport] = useState([]);
    const [equipReport, setEquipReport] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamsRes = await axios.get('http://localhost:5000/api/reports/teams');
                const equipRes = await axios.get('http://localhost:5000/api/reports/equipment');
                setTeamReport(teamsRes.data);
                setEquipReport(equipRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching reports:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="reports-page-container" style={{ padding: '20px' }}>
            <h2>Insights & Reports</h2>

            {loading ? <p>Loading reports...</p> : (
                <div className="reports-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                    <div className="report-card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>Requests per Maintenance Team</h3>
                        {teamReport.length === 0 ? <p>No data available</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                        <th style={{ padding: '8px' }}>Team Name</th>
                                        <th style={{ padding: '8px' }}>Requests</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamReport.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '8px' }}>{item.team_name || 'Unassigned'}</td>
                                            <td style={{ padding: '8px' }}>{item.request_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="report-card" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                        <h3>Top Equipment by Requests</h3>
                        {equipReport.length === 0 ? <p>No data available</p> : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                        <th style={{ padding: '8px' }}>Equipment Name</th>
                                        <th style={{ padding: '8px' }}>Requests</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {equipReport.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '8px' }}>{item.equipment_name}</td>
                                            <td style={{ padding: '8px' }}>{item.request_count}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
};

export default ReportsPage;
