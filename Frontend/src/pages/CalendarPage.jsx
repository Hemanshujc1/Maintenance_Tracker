import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css'; // Assuming shared styles or creating new specific css if needed

const CalendarPage = () => {
    const [requests, setRequests] = useState([]);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        scheduled_date: '',
        priority: 'Medium',
        equipment_id: '',
        requestor_id: 1 // Default to user 1 for now or get from context if available
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCalendarData();
    }, []);

    const fetchCalendarData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/calendar');
            setRequests(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching calendar data:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/calendar/request', formData);
            alert('Preventive Maintenance Scheduled!');
            fetchCalendarData(); // Refresh calendar
            setFormData({ ...formData, subject: '', description: '', scheduled_date: '', equipment_id: '' });
        } catch (error) {
            console.error('Error scheduling maintenance:', error);
            alert('Failed to schedule.');
        }
    };

    return (
        <div className="calendar-page-container" style={{ padding: '20px' }}>
            <h2>Preventive Maintenance Calendar</h2>

            <div className="schedule-form" style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <h3>Schedule New Maintenance</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <input name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} required />
                    <input name="equipment_id" type="number" placeholder="Equipment ID" value={formData.equipment_id} onChange={handleInputChange} required />
                    <input name="scheduled_date" type="date" value={formData.scheduled_date} onChange={handleInputChange} required />
                    <select name="priority" value={formData.priority} onChange={handleInputChange}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                    <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} style={{ gridColumn: 'span 2' }} />
                    <button type="submit" style={{ gridColumn: 'span 2', padding: '10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', cursor: 'pointer' }}>Schedule</button>
                </form>
            </div>

            <div className="calendar-view">
                <h3>Scheduled Jobs</h3>
                {loading ? <p>Loading...</p> : (
                    <div className="events-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                        {requests.length === 0 ? <p>No scheduled maintenance found.</p> : requests.map(req => (
                            <div key={req.id} className="event-card" style={{ padding: '15px', border: '1px solid #eee', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                <h4>{req.subject}</h4>
                                <p><strong>Date:</strong> {new Date(req.scheduled_date).toLocaleDateString()}</p>
                                <p><strong>Equipment:</strong> {req.Equipment?.name || 'Unknown'}</p>
                                <p><strong>Tech:</strong> {req.assignedTechnician ? `${req.assignedTechnician.first_name} ${req.assignedTechnician.last_name}` : 'Unassigned'}</p>
                                <span style={{ padding: '3px 8px', borderRadius: '10px', backgroundColor: '#eef', fontSize: '0.8em' }}>{req.status}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
