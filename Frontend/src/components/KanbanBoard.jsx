import React from 'react';

const KanbanColumn = ({ status, requests, onDrop, onDragStart }) => {
    return (
        <div
            className="flex-1 bg-gray-100 p-4 rounded-lg min-h-[500px]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, status)}
        >
            <h3 className="text-lg font-bold mb-4 capitalize">{status.replace('_', ' ')}</h3>
            <div className="space-y-3">
                {requests.map(req => (
                    <div
                        key={req.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, req.id)}
                        className="bg-white p-3 rounded shadow hover:shadow-md cursor-grab active:cursor-grabbing border-l-4"
                        style={{
                            borderLeftColor: req.priority === 'Critical' ? 'red' :
                                req.priority === 'High' ? 'orange' :
                                    req.priority === 'Medium' ? 'blue' : 'green'
                        }}
                    >
                        <h4 className="font-semibold text-sm">{req.subject}</h4>
                        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                            <span>{req.Equipment ? req.Equipment.name : 'Unknown Equipment'}</span>
                            <span className={`px-2 py-0.5 rounded text-white ${req.type === 'Corrective' ? 'bg-red-500' : 'bg-green-500'
                                }`}>
                                {req.type[0]}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Technician: {req.assignedTechnician ? req.assignedTechnician.first_name : 'Unassigned'}
                        </div>
                    </div>
                ))}
                {requests.length === 0 && <p className="text-gray-400 text-center text-sm">No items</p>}
            </div>
        </div>
    );
};

const KanbanBoard = ({ requests, onStatusChange }) => {
    const statuses = ['New', 'In Progress', 'Repaired', 'Scrap'];
    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('requestId', id);
    };
    const handleDrop = (e, newStatus) => {
        const requestId = e.dataTransfer.getData('requestId');
        if (requestId) {
            onStatusChange(requestId, newStatus);
        }
    };
    return (
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
            {statuses.map(status => (
                <KanbanColumn
                    key={status}
                    status={status}
                    requests={requests.filter(r => r.status === status)}
                    onDrop={handleDrop}
                    onDragStart={handleDragStart}
                />
            ))}
        </div>
    );
};

export default KanbanBoard;
