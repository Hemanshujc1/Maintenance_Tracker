import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import KanbanBoardComponent from '../components/KanbanBoard';

const KanbanBoard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, [searchParams]);

    const fetchRequests = async () => {
        try {
            const equipmentId = searchParams.get('equipment_id');
            // Assuming backend supports filtering by equipment_id via query param on /requests ??
            // If not, we fetch all and filter client side for now, or update backend.
            // requestController.getAllRequests handles query params!
            
            let url = '/requests';
            if (equipmentId) {
                // Determine if backend supports it. Checked code: 
                // const { status, type, technician_id } = req.query; 
                // Backend DOES NOT support equipment_id filter in getAllRequests.
                // I should probably fix backend or filter locally.
                // For safety/speed, I'll filter locally if equipment_id is present.
            }
            
            const res = await api.get(url);
            let data = res.data;

            if (equipmentId) {
                data = data.filter(r => r.equipment_id == equipmentId);
            }

            setRequests(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch requests", error);
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
            fetchRequests(); // Revert
        }
    };

    const handleDurationChange = async (id, duration) => {
        try {
            await api.put(`/requests/${id}/duration`, { duration_hours: duration });
            setRequests(prev => prev.map(r => r.id == id ? { ...r, duration_hours: duration } : r));
        } catch (err) {
            console.error("Failed to update duration", err);
            fetchRequests();
        }
    };

    if (loading) return <div className="kanban-loading">Loading Board...</div>;

    const equipmentId = searchParams.get('equipment_id');

    return (
        <div className="kanban-page-container" style={{ padding: '20px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="kanban-header" style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                <h2>
                    {equipmentId ? 'Equipment Maintenance Board' : 'Maintenance Kanban Board'}
                </h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {equipmentId && (
                        <button onClick={() => navigate('/kanban')} className="btn-secondary" style={{ padding: '10px', background: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                            Clear Filter
                        </button>
                    )}
                    <button onClick={() => navigate('/equipment')} className="btn-add-task" style={{ background: '#7c3aed', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                        + New Request
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

export default KanbanBoard;
