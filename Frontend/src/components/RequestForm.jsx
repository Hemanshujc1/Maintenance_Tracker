import React, { useState, useEffect } from 'react';
import requestService from '../services/requestService';
import api from '../utils/api';

const RequestForm = ({ onRequestCreated }) => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        type: 'Corrective',
        priority: 'Medium',
        equipment_id: '',
        requestor_id: 1
    });
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
                // Fallback for dev if API fails
                setEquipmentList([{ id: 1, name: 'Mock Equipment' }]);
            }
        };
        fetchEquipment();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await requestService.createRequest(formData);
            setFormData({
                subject: '',
                description: '',
                type: 'Corrective',
                priority: 'Medium',
                equipment_id: '',
                requestor_id: 1
            });
            if (onRequestCreated) onRequestCreated();
        } catch (err) {
            setError('Failed to create request');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Create Maintenance Request</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="Corrective">Corrective</option>
                        <option value="Preventive">Preventive</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment</label>
                    <select
                        name="equipment_id"
                        value={formData.equipment_id}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="">Select Equipment</option>
                        {equipmentList.map(eq => (
                            <option key={eq.id} value={eq.id}>{eq.name} (SN: {eq.serial_number})</option>
                        ))}
                    </select>
                </div>
                <div className="col-span-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                    >
                        {loading ? 'Creating...' : 'Create Request'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RequestForm;
