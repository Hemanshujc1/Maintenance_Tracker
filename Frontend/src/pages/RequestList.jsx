import React, { useEffect, useState } from 'react';
import requestService from '../services/requestService';
import RequestForm from '../components/RequestForm';
import KanbanBoard from '../components/KanbanBoard';

const RequestList = () => {
    const [requests, setRequests] = useState([]);
    const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'

    const fetchRequests = async () => {
        try {
            const data = await requestService.getAllRequests();
            setRequests(data);
        } catch (error) {
            console.error("Error fetching requests", error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleStatusChange = async (id, newStatus) => {
        // Optimistic update
        setRequests(prev => prev.map(r => r.id == id ? { ...r, status: newStatus } : r));

        try {
            await requestService.updateStatus(id, newStatus);
            // Optionally refetch to confirm
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on failure
            fetchRequests();
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Maintenance Logic & Requests</h1>

            <RequestForm onRequestCreated={fetchRequests} />

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Requests Board</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setViewMode('kanban')}
                        className={`px-3 py-1 rounded ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        Kanban
                    </button>
                    {/* List view placeholder for future */}
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    >
                        List
                    </button>
                </div>
            </div>

            {viewMode === 'kanban' ? (
                <KanbanBoard requests={requests} onStatusChange={handleStatusChange} />
            ) : (
                <div className="bg-white p-4 rounded shadow">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left p-2">ID</th>
                                <th className="text-left p-2">Subject</th>
                                <th className="text-left p-2">Status</th>
                                <th className="text-left p-2">Priority</th>
                                <th className="text-left p-2">Assignee</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(r => (
                                <tr key={r.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{r.id}</td>
                                    <td className="p-2">{r.subject}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded text-xs text-white ${r.status === 'New' ? 'bg-blue-400' :
                                                r.status === 'In Progress' ? 'bg-yellow-400' :
                                                    r.status === 'Repaired' ? 'bg-green-400' : 'bg-gray-500'
                                            }`}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td className="p-2">{r.priority}</td>
                                    <td className="p-2">{r.assignedTechnician ? r.assignedTechnician.first_name : '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default RequestList;
