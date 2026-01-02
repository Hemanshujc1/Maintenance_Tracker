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

    const [filterDepartment, setFilterDepartment] = useState('All');

    const filterData = () => {
        let data = equipment;

        // Status Filter
        if (filterStatus !== 'All') {
            data = data.filter(item => item.status === filterStatus);
        }

        // Department Filter
        if (filterDepartment !== 'All') {
            data = data.filter(item => item.Department && item.Department.name === filterDepartment);
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
        <div className="container" style={{ paddingBottom: '40px' }}>
            <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ marginBottom: '5px' }}>Equipment Assets</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and track your machinery.</p>
                </div>
                <Link to="/equipment/new" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>+ Add Equipment</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="filters-bar" style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="Search Name or Serial..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        width: '300px',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                    }}
                />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Scrapped">Scrapped</option>
                </select>

                <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)'
                    }}
                >
                    <option value="All">All Departments</option>
                    {/* Unique departments from equipment list */}
                    {[...new Set(equipment.map(item => item.Department ? item.Department.name : null).filter(Boolean))].map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
            </div>

            <div className="equipment-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '25px'
            }}>
                {filteredEquipment.map(item => (
                    <div key={item.id} className="equipment-card" style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                        boxShadow: 'var(--card-shadow)',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Card Image Header */}
                        <div className="card-image-header" style={{ height: '200px', position: 'relative' }}>
                            <img
                                src={item.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600'}
                                alt={item.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{ position: 'absolute', top: '15px', right: '15px' }}>
                                <span className={`status-badge ${item.status.toLowerCase()}`} style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {item.status}
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="card-body" style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                                    <Link to={`/equipment/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                        {item.name}
                                    </Link>
                                </h3>
                                <div style={{
                                    display: 'inline-block',
                                    background: 'var(--bg-primary)',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    {item.serial_number}
                                </div>
                            </div>

                            <div className="card-details-grid" style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '15px',
                                marginBottom: '20px',
                                fontSize: '0.9rem'
                            }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>Department</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.Department?.name || '-'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>Team</div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.MaintenanceTeam?.name || '-'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>Location</div>
                                    <div style={{ color: 'var(--text-primary)' }}>📍 {item.location || '-'}</div>
                                </div>
                                <div>
                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '2px' }}>Warranty</div>
                                    <div style={{
                                        color: item.warranty_expiry && new Date(item.warranty_expiry) < new Date() ? '#ef4444' : '#22c55e',
                                        fontWeight: '500'
                                    }}>
                                        {item.warranty_expiry ? new Date(item.warranty_expiry).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            <div className="card-footer" style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                <Link to={`/equipment/${item.id}`} className="btn-secondary" style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    background: 'var(--bg-primary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--border-color)',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    fontWeight: '500'
                                }}>
                                    View Details
                                </Link>
                                <Link to={`/equipment/${item.id}/edit`} className="btn-icon" style={{
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    ✎
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEquipment.length === 0 && (
                <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-muted)' }}>
                    No equipment found matching your filters.
                </div>
            )}
        </div>
    );
};

export default EquipmentList;
