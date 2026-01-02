import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Holidays from 'date-holidays';
import api from '../utils/api';
import RequestForm from '../components/RequestForm';
import './CalendarPage.css';

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
            // 1. Fetch Maintenance Requests
            const res = await api.get('/requests');
            const maintenanceEvents = res.data
                .filter(req => req.scheduled_date)
                .map(req => {
                    // Start date
                    const startDate = new Date(req.scheduled_date);
                    // End date (default +1 hour if not specified, though usually backend might have duration)
                    // FullCalendar handles null end dates by assuming default duration, but better to be explicit
                    const endDate = req.completion_date ? new Date(req.completion_date) : new Date(startDate.getTime() + 60 * 60 * 1000);

                    // Color coding
                    let backgroundColor = '#3b82f6'; // blue
                    if (req.status === 'Repaired') backgroundColor = '#22c55e'; // green
                    if (req.status === 'Scrap') backgroundColor = '#ef4444'; // red
                    if (req.status === 'New') backgroundColor = '#a855f7'; // purple

                    return {
                        id: req.id,
                        title: `${req.Equipment ? req.Equipment.name : 'Unknown'} (${req.Equipment?.location || 'No Loc'}): ${req.subject}`,
                        start: startDate,
                        end: endDate,
                        backgroundColor: backgroundColor,
                        borderColor: backgroundColor,
                        extendedProps: {
                            type: 'maintenance',
                            status: req.status,
                            resource: req
                        }
                    };
                });

            // 2. Fetch Holidays
            const hd = new Holidays('IN');
            const currentYear = new Date().getFullYear();
            const nextYear = currentYear + 1;

            // Get holidays for current and next year to cover edges
            const holidayEvents = [
                ...hd.getHolidays(currentYear),
                ...hd.getHolidays(nextYear)
            ].map(h => ({
                id: `holiday-${h.date}-${h.name}`,
                title: `🎉 ${h.name}`,
                start: h.start,
                end: h.end,
                backgroundColor: '#f59e0b', // Amber
                borderColor: '#f59e0b',
                allDay: true,
                extendedProps: {
                    type: 'holiday',
                    description: h.type
                }
            }));

            setEvents([...maintenanceEvents, ...holidayEvents]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching calendar events:', error);
            setLoading(false);
        }
    };

    const handleDateClick = (arg) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Disable past dates logic if desired, or keep it open
        if (arg.date >= today) {
            setSelectedDate(arg.dateStr); // 'YYYY-MM-DD'
            setShowModal(true);
        }
    };

    return (
        <div className="calendar-page-outer">
            <h2 className="calendar-title">Preventive Maintenance Schedule</h2>
            <div className="calendar-container">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    events={events}
                    dateClick={handleDateClick}
                    height="100%"
                    editable={false}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    eventClick={(info) => {
                        // Optional: could open details modal
                        // alert('Event: ' + info.event.title);
                    }}
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
