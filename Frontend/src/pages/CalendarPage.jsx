import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../utils/api';
import RequestForm from '../components/RequestForm';
import './CalendarPage.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/requests'); // Fetch ALL requests
            const formattedEvents = res.data
                .filter(req => req.scheduled_date) // Only show scheduled ones
                .map(req => {
                    const startDate = new Date(req.scheduled_date);
                    // Add 1 hour duration by default so it shows up in Week/Day views
                    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); 
                    
                    return {
                        id: req.id,
                        title: `${req.Equipment ? req.Equipment.name : 'Unknown'} (${req.Equipment?.location || 'No Loc'}): ${req.subject}`,
                        start: startDate,
                        end: endDate, 
                        allDay: false, 
                        status: req.status,
                        resource: req
                    };
                });
            setEvents(formattedEvents);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            setLoading(false);
        }
    };

    const handleSelectSlot = ({ start }) => {
        // Only allow future dates or today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (start >= today) {
            setSelectedDate(format(start, 'yyyy-MM-dd'));
            setShowModal(true);
        }
    };

    const handleEventStyle = (event) => {
        let backgroundColor = '#3b82f6'; // blue
        if (event.status === 'Repaired') backgroundColor = '#22c55e'; // green
        if (event.status === 'Scrap') backgroundColor = '#ef4444'; // red
        if (event.status === 'New') backgroundColor = '#a855f7'; // purple

        return {
            style: {
                backgroundColor,
                borderRadius: '4px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    return (
        <div className="calendar-page-outer">
            <h2 className="calendar-title">Preventive Maintenance Schedule</h2>
            <div className="calendar-container">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 'calc(100vh - 150px)' }}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    eventPropGetter={handleEventStyle}
                    views={['month', 'week', 'agenda']}
                />
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            onClick={() => setShowModal(false)}
                            className="modal-close"
                        >
                            &times;
                        </button>
                        <RequestForm 
                            initialDate={selectedDate}
                            onRequestCreated={() => {
                                setShowModal(false);
                                fetchEvents();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalendarPage;
