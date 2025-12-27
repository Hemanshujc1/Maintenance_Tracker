import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await axios.get('http://localhost:5001/api/equipment');
            setEquipment(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch equipment');
            setLoading(false);
        }
    };

    const handleScrap = async (id) => {
        if (!window.confirm('Are you sure you want to scrap this equipment?')) return;
        try {
            await axios.put(`http://localhost:5001/api/equipment/${id}/scrap`);
            fetchEquipment(); // Refresh list
        } catch (err) {
            alert('Failed to scrap equipment');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="container">
            <h1>Equipment Management</h1>
            <Link to="/equipment/new" className="btn btn-primary">Add New Equipment</Link>
            
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Serial Number</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {equipment.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.serial_number}</td>
                            <td>{item.location}</td>
                            <td>
                                <span className={`status-${item.status.toLowerCase()}`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>
                                <Link to={`/equipment/${item.id}`} className="btn btn-secondary">Edit</Link>
                                {item.status !== 'Scrapped' && (
                                    <button onClick={() => handleScrap(item.id)} className="btn btn-danger">
                                        Scrap
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EquipmentList;
