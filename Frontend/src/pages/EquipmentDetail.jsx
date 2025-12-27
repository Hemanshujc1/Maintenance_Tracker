import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import RequestForm from '../components/RequestForm';
import './EquipmentDetail.css';

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);

    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            const res = await api.get(`/equipment/${id}`);
            setEquipment(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch equipment details", err);
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Details...</div>;
    if (!equipment) return <div className="p-8 text-center text-red-600">Equipment not found</div>;

    return (
        <div className="equipment-detail-container">
            {/* Header */}
            <div className="detail-header">
                <div>
                    <h1 className="equipment-title">{equipment.name}</h1>
                    <p className="equipment-serial">Serial: {equipment.serial_number}</p>
                </div>
                <div className="action-buttons">
                    <button 
                        onClick={() => setShowRequestModal(true)}
                        className="btn-request"
                    >
                        Request Maintenance
                    </button>
                    <Link 
                        to={`/equipment/${id}/edit`} 
                        className="btn-edit"
                    >
                        Edit
                    </Link>
                </div>
            </div>

            {/* Status Bar */}
            <div className="status-bar">
                <div className="status-info">
                    <span className={`badge ${equipment.status.toLowerCase()}`}>
                        {equipment.status}
                    </span>
                    <span className="info-item">
                        Department: <strong>{equipment.Department ? equipment.Department.name : 'N/A'}</strong>
                    </span>
                    <span className="info-item">
                        Location: <strong>{equipment.location || 'N/A'}</strong>
                    </span>
                </div>
                 
                <Link to={`/kanban?equipment_id=${equipment.id}`} className="smart-button" style={{ textDecoration: 'none' }}>
                    <div className="smart-count">
                        {equipment.Requests ? equipment.Requests.length : 0}
                    </div>
                    <div className="smart-label">
                        Maintenance<br/>Requests
                    </div>
                </Link>
            </div>

            {/* Info Grid */}
            <div className="info-grid">
                <div className="card">
                    <h3>Asset Information</h3>
                    <div className="field-grid">
                        <div>
                            <div className="field-label">Purchase Date</div>
                            <div className="field-value">{equipment.purchase_date || '-'}</div>
                        </div>
                        <div>
                            <div className="field-label">Warranty Expiry</div>
                            <div className="field-value">{equipment.warranty_expiry || '-'}</div>
                        </div>
                        <div>
                            <div className="field-label">Assigned Employee</div>
                            <div className="field-value">{equipment.assignedEmployee ? `${equipment.assignedEmployee.first_name} ${equipment.assignedEmployee.last_name || ''}` : 'Unassigned'}</div>
                        </div>
                        <div>
                            <div className="field-label">Maintenance Team</div>
                            <div className="field-value">{equipment.MaintenanceTeam ? equipment.MaintenanceTeam.name : 'None'}</div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3>Description</h3>
                    <p style={{ lineHeight: '1.6', color: '#475569' }}>{equipment.description || 'No description provided.'}</p>
                </div>
            </div>

            {/* History Table */}
            <div className="history-section">
                <div className="history-header">
                    <h3>Maintenance History</h3>
                </div>
                <div className="table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Subject</th>
                                <th>Technician</th>
                                <th>Status</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.Requests && equipment.Requests.length > 0 ? (
                                equipment.Requests.map(req => (
                                    <tr key={req.id}>
                                        <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                                        <td>{req.subject}</td>
                                        <td>{req.assignedTechnician ? req.assignedTechnician.first_name : '-'}</td>
                                        <td>
                                            <span className={`status-pill ${
                                                req.status === 'New' ? 'new' :
                                                req.status === 'In Progress' ? 'progress' :
                                                req.status === 'Repaired' ? 'repaired' : 'scrap'
                                            }`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td>{req.priority}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No maintenance history found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showRequestModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            onClick={() => setShowRequestModal(false)}
                            className="modal-close"
                        >
                            &times;
                        </button>
                        <RequestForm 
                            initialEquipmentId={equipment.id} 
                            onRequestCreated={() => {
                                setShowRequestModal(false);
                                fetchDetails(); // Refresh
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EquipmentDetail;
