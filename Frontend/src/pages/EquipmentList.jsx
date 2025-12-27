import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [filteredEquipment, setFilteredEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        fetchEquipment();
    }, []);

    useEffect(() => {
        filterData();
    }, [equipment, searchTerm, filterStatus]);

    const fetchEquipment = async () => {
        try {
            const response = await api.get('/equipment');
            setEquipment(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch equipment');
            setLoading(false);
        }
    };

    const filterData = () => {
        let data = equipment;

        // Status Filter
        if (filterStatus !== 'All') {
            data = data.filter(item => item.status === filterStatus);
        }

        // Search Filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            data = data.filter(item => 
                item.name.toLowerCase().includes(lowerTerm) || 
                item.serial_number.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredEquipment(data);
    };

    const handleScrap = async (id) => {
        if (!window.confirm('Are you sure you want to scrap this equipment?')) return;
        try {
            await api.put(`/equipment/${id}/scrap`);
            fetchEquipment(); // Refresh list
        } catch (err) {
            alert('Failed to scrap equipment');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1>Equipment Management</h1>
                <Link to="/equipment/new" className="btn btn-primary">Add New Equipment</Link>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    placeholder="Search Name or Serial..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', width: '250px' }}
                />
                <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Scrapped">Scrapped</option>
                </select>
            </div>
            
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Serial Number</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Requests</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEquipment.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td>
                                <Link to={`/equipment/${item.id}`} className="text-blue-600 font-medium hover:underline">
                                    {item.name}
                                </Link>
                            </td>
                            <td>{item.serial_number}</td>
                            <td>{item.location || '-'}</td>
                            <td>
                                <span className={`status-badge ${item.status.toLowerCase()}`}>
                                    {item.status}
                                </span>
                            </td>
                             <td>
                                <span style={{ 
                                    background: '#e0f2fe', 
                                    color: '#0369a1', 
                                    padding: '4px 8px', 
                                    borderRadius: '12px', 
                                    fontWeight: '600',
                                    fontSize: '0.8rem'
                                }}>
                                    {item.Requests ? item.Requests.length : 0}
                                </span>
                            </td>
                            <td>
                                <Link to={`/equipment/${item.id}/edit`} className="btn btn-secondary">Edit</Link>
                                {item.status !== 'Scrapped' && (
                                    <button onClick={() => handleScrap(item.id)} className="btn btn-danger">
                                        Scrap
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {filteredEquipment.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No equipment found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentList;
