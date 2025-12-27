import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate, useParams } from 'react-router-dom';

const EquipmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        serial_number: '',
        description: '',
        purchase_date: '',
        warranty_expiry: '',
        location: '',
        status: 'Active',
        department_id: '',
        assigned_employee_id: '',
        maintenance_team_id: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchEquipmentDetails();
        }
    }, [id]);

    const fetchEquipmentDetails = async () => {
        try {
            const response = await api.get(`/equipment/${id}`);
            const data = response.data;
            // Format dates for input fields (YYYY-MM-DD)
            if (data.purchase_date) data.purchase_date = data.purchase_date.split('T')[0];
            if (data.warranty_expiry) data.warranty_expiry = data.warranty_expiry.split('T')[0];
            setFormData(data);
        } catch (err) {
            setError('Failed to load equipment details');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Sanitize payload: convert empty strings to null for optional fields
            const payload = { ...formData };
            const optionalFields = ['department_id', 'assigned_employee_id', 'maintenance_team_id', 'purchase_date', 'warranty_expiry'];
            optionalFields.forEach(field => {
                if (payload[field] === '') {
                    payload[field] = null;
                }
            });

            if (isEditMode) {
                await api.put(`/equipment/${id}`, payload);
            } else {
                await api.post('/equipment', payload);
            }
            navigate('/equipment');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save equipment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>{isEditMode ? 'Edit Equipment' : 'Add New Equipment'}</h1>
            {error && <div className="error">{error}</div>}
            
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label>Serial Number:</label>
                    <input type="text" name="serial_number" value={formData.serial_number} onChange={handleChange} required />
                </div>
                
                <div className="form-group">
                    <label>Description:</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label>Location:</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label>Purchase Date:</label>
                    <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
                </div>
                
                <div className="form-group">
                    <label>Warranty Expiry:</label>
                    <input type="date" name="warranty_expiry" value={formData.warranty_expiry} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Status:</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Scrapped">Scrapped</option>
                    </select>
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                </button>
            </form>
        </div>
    );
};

export default EquipmentForm;
