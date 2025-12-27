import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import KanbanBoardComponent from '../components/KanbanBoard';
import { useAuth } from '../context/AuthContext';

const TechnicianDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            // Get all requests and filter by assigned_technician_id on client side
            // Ideally backend should support /requests?technician_id=X
            const res = await api.get('/requests');
            const myTasks = res.data.filter(r => r.assigned_technician_id === user.id);
            setRequests(myTasks);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch my tasks", error);
            setLoading(false);
        }
    };

    const handleStatusChange = async (draggableId, newStatus) => {
        // Optimistic Update
        const updatedRequests = requests.map(r => 
            r.id == draggableId ? { ...r, status: newStatus } : r
        );
        setRequests(updatedRequests);

        try {
            await api.put(`/requests/${draggableId}/status`, { status: newStatus });
        } catch (err) {
            console.error("Failed to update status", err);
            fetchMyTasks(); // Revert
        }
    };

    const handleDurationChange = async (id, duration) => {
        try {
            await api.put(`/requests/${id}/duration`, { duration_hours: duration });
            // Update local state without refetching for smoothness
            setRequests(prev => prev.map(r => r.id == id ? { ...r, duration_hours: duration } : r));
        } catch (err) {
            console.error("Failed to update duration", err);
            fetchMyTasks();
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading Dashboard...</div>;

    return (
        <div className="kanban-page-container" style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="dashboard-header" style={{ marginBottom: '20px' }}>
                <h1 style={{ color: '#1e293b', marginBottom: '10px' }}>Hello, {user.first_name} 👋</h1>
                <p style={{ color: '#64748b' }}>Here are your assigned maintenance tasks.</p>
            </div>

            <div className="kanban-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#334155' }}>My Task Board</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => navigate('/calendar')} className="btn-secondary" style={{ padding: '10px 15px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        View Schedule
                    </button>
                    <button onClick={() => navigate('/equipment')} className="btn-secondary" style={{ padding: '10px 15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        Equipment List
                    </button>
                </div>
            </div>
            
            <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                 <KanbanBoardComponent 
                    requests={requests} 
                    onStatusChange={handleStatusChange} 
                    onDurationChange={handleDurationChange}
                 />
            </div>
        </div>
    );
};

export default TechnicianDashboard;
