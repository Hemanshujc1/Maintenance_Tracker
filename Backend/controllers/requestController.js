const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
    try {
        const { subject, description, type, priority, equipment_id, requestor_id } = req.body;

        const newRequest = await Request.create({
            subject,
            description,
            type,
            priority,
            equipment_id,
            requestor_id
        });

        res.status(201).json(newRequest);
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ message: 'Server error creating request' });
    }
};

exports.getAllRequests = async (req, res) => {
    try {
        const { status, type, technician_id } = req.query;
        const whereClause = {};
        if (status) whereClause.status = status;
        if (type) whereClause.type = type;
        if (technician_id) whereClause.assigned_technician_id = technician_id;

        const requests = await Request.findAll({
            where: whereClause,
            include: [
                { model: Equipment, attributes: ['name', 'serial_number'] },
                { model: User, as: 'requestor', attributes: ['first_name', 'last_name'] },
                { model: User, as: 'assignedTechnician', attributes: ['first_name', 'last_name'] }
            ],
            order: [['created_at', 'DESC']]
        });

        res.json(requests);
    } catch (error) {
        console.error('Error fetching requests:', error);
        res.status(500).json({ message: 'Server error fetching requests' });
    }
};

exports.getRequestById = async (req, res) => {
    try {
        const request = await Request.findByPk(req.params.id, {
            include: [
                { model: Equipment },
                { model: User, as: 'requestor' },
                { model: User, as: 'assignedTechnician' }
            ]
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        res.json(request);
    } catch (error) {
        console.error('Error fetching request:', error);
        res.status(500).json({ message: 'Server error fetching request' });
    }
};

// Update Request Status
exports.updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await Request.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }
        if (status === 'Repaired' && request.status !== 'Repaired') {
            request.completion_date = new Date();
        }

        request.status = status;
        await request.save();

        res.json(request);
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

exports.assignTechnician = async (req, res) => {
    try {
        const { technician_id } = req.body;
        const request = await Request.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.assigned_technician_id = technician_id;
        if (request.status === 'New') {
            request.status = 'In Progress';
        }
        await request.save();
        res.json(request);
    } catch (error) {
        console.error('Error assigning technician:', error);
        res.status(500).json({ message: 'Server error assigning technician' });
    }
};

exports.updateDuration = async (req, res) => {
    try {
        const { duration_hours } = req.body;
        const request = await Request.findByPk(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.duration_hours = duration_hours;
        await request.save();

        res.json(request);
    } catch (error) {
        console.error('Error updating duration:', error);
        res.status(500).json({ message: 'Server error updating duration' });
    }
};
