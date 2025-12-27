import React, { useState, useEffect } from 'react';
import requestService from '../services/requestService';
import api from '../utils/api';
import './RequestForm.css';

const RequestForm = ({ onRequestCreated, initialEquipmentId, initialDate }) => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        type: initialDate ? 'Preventive' : 'Corrective',
        priority: 'Medium',
        equipment_id: initialEquipmentId || '',
        requestor_id: 1, 
        scheduled_date: initialDate || ''
    });
    
    const [image, setImage] = useState(null);
    const [equipmentList, setEquipmentList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const res = await api.get('/equipment');
                setEquipmentList(res.data);
            } catch (err) {
                console.error("Failed to load equipment", err);
            }
        };
        fetchEquipment();
    }, []);

    useEffect(() => {
        if (initialEquipmentId) {
            setFormData(prev => ({ ...prev, equipment_id: initialEquipmentId }));
        }
    }, [initialEquipmentId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handlePriorityClick = (p) => {
        setFormData({ ...formData, priority: p });
    };

    const handleTypeClick = (t) => {
        setFormData({ ...formData, type: t });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (formData.type === 'Preventive' && !formData.scheduled_date) {
            setError('Scheduled Date is required for Preventive Maintenance.');
            setLoading(false);
            return;
        }

        try {
            const data = new FormData();
            data.append('subject', formData.subject);
            data.append('description', formData.description);
            data.append('type', formData.type);
            data.append('priority', formData.priority);
            data.append('equipment_id', formData.equipment_id);
            data.append('requestor_id', formData.requestor_id);
            if (formData.scheduled_date) data.append('scheduled_date', formData.scheduled_date);
            if (image) data.append('image', image);

            await requestService.createRequest(data);
            
            setFormData({
                subject: '',
                description: '',
                type: 'Corrective',
                priority: 'Medium',
                equipment_id: initialEquipmentId || '',
                requestor_id: 1,
                scheduled_date: ''
            });
            setImage(null);
            
            if (onRequestCreated) onRequestCreated();
        } catch (err) {
            setError('Failed to create request. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const selectedEquipment = equipmentList.find(e => e.id == formData.equipment_id);

    return (
        <div className="request-form">
            <h2 className="form-header">Create Service Request</h2>
            
            {error && (
                <div className="form-error">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Equipment Context */}
                {initialEquipmentId && selectedEquipment ? (
                    <div className="context-card">
                         <div className="context-label">For Equipment</div>
                         <div className="context-title">{selectedEquipment.name}</div>
                         <div className="context-subtitle">SN: {selectedEquipment.serial_number}</div>
                    </div>
                ) : (
                    <div className="form-group">
                        <label className="form-label">Select Equipment</label>
                        <select
                            name="equipment_id"
                            value={formData.equipment_id}
                            onChange={handleChange}
                            required
                            className="form-select"
                        >
                            <option value="">-- Choose Asset --</option>
                            {equipmentList.map(eq => (
                                <option key={eq.id} value={eq.id}>{eq.name} - {eq.serial_number}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Subject */}
                <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="E.g., Engine Overheating"
                        className="form-input"
                    />
                </div>

                {/* Type Selection */}
                <div className="form-group">
                    <label className="form-label">Request Type</label>
                    <div className="selector-group">
                        {['Corrective', 'Preventive'].map(type => (
                            <button
                                type="button"
                                key={type}
                                onClick={() => handleTypeClick(type)}
                                className={`selector-btn ${formData.type === type ? 'active' : ''}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Priority Selection */}
                <div className="form-group">
                    <label className="form-label">Priority</label>
                    <div className="selector-group">
                        {['Low', 'Medium', 'High', 'Critical'].map(p => (
                            <button
                                type="button"
                                key={p}
                                onClick={() => handlePriorityClick(p)}
                                className={`selector-btn priority-${p.toLowerCase()} ${formData.priority === p ? 'active' : ''}`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scheduled Date */}
                {formData.type === 'Preventive' && (
                    <div className="form-group">
                        <label className="form-label">Scheduled Date</label>
                        <input
                            type="date"
                            name="scheduled_date"
                            value={formData.scheduled_date}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>
                )}

                {/* Description */}
                <div className="form-group">
                    <label className="form-label">Description / Notes</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Describe the issue..."
                        className="form-textarea"
                    />
                </div>

                {/* Image Upload */}
                <div className="form-group">
                    <label className="form-label">Attach Image (Optional)</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-input"
                    />
                </div>

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-submit"
                >
                    {loading ? 'Creating Request...' : 'Submit Request'}
                </button>
            </form>
        </div>
    );
};

export default RequestForm;
