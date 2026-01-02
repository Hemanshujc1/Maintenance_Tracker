const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const User = require('../models/User');

exports.createRequest = async (req, res) => {
    try {
        const { subject, description, type, priority, equipment_id, requestor_id } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;

        const newRequest = await Request.create({
            subject,
            description,
            type,
            priority,
            equipment_id,
            requestor_id,
            image_url
        });

        // Auto-assign default technician if available
        const equipment = await Equipment.findByPk(equipment_id);
        if (equipment && equipment.default_technician_id) {
            newRequest.assigned_technician_id = equipment.default_technician_id;
            await newRequest.save();
        }

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
                { model: Equipment, attributes: ['name', 'serial_number', 'location', 'image_url'] },
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

        // Scrap Logic: If Request is Scrap, Equipment is Scrapped
        if (status === 'Scrap') {
            const equipment = await Equipment.findByPk(request.equipment_id);
            if (equipment) {
                equipment.status = 'Scrapped';
                await equipment.save();
            }
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
        const request = await Request.findByPk(req.params.id, {
            include: [{ model: Equipment }]
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Validate Technician Team Membership
        if (request.Equipment && request.Equipment.maintenance_team_id) {
            const technician = await User.findByPk(technician_id);
            if (!technician || technician.maintenance_team_id !== request.Equipment.maintenance_team_id) {
                return res.status(400).json({
                    message: 'Technician must belong to the maintenance team assigned to this equipment.'
                });
            }
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
