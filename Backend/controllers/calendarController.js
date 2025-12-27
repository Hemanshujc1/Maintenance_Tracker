const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

// Get requests with scheduled dates (for Calendar)
exports.getCalendarRequests = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        // In a real app, we would filter by date range, but for now fetch all simplified
        // Or implement basic range filtering if needed
        
        const requests = await Request.findAll({
            where: {
                // Ensure we only retrieve requests that have a scheduled date
                scheduled_date: {
                    $not: null
                }
            },
            include: [
                { model: Equipment, attributes: ['name'] },
                { model: User, as: 'assignedTechnician', attributes: ['first_name', 'last_name'] }
            ],
            attributes: ['id', 'subject', 'scheduled_date', 'status', 'type', 'priority']
        });

        // Format for frontend calendar if necessary, or send raw
        res.json(requests);
    } catch (error) {
        console.error('Error fetching calendar requests:', error);
        res.status(500).json({ message: 'Server error fetching calendar data' });
    }
};

// Create a scheduled Preventive Request (Click-to-schedule)
exports.createScheduledRequest = async (req, res) => {
    try {
        const { subject, description, equipment_id, requestor_id, scheduled_date, priority } = req.body;

        const newRequest = await Request.create({
            subject,
            description,
            type: 'Preventive', // Force type to Preventive
            priority: priority || 'Medium',
            status: 'New',
            equipment_id,
            requestor_id,
            scheduled_date
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating scheduled request:', error);
        res.status(500).json({ message: 'Server error creating scheduled request' });
    }
};
