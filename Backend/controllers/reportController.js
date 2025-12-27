const Request = require('../models/Request');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const sequelize = require('../config/db');

// Get Requests count per Maintenance Team
exports.getRequestsPerTeam = async (req, res) => {
    try {
        // We need to join Request -> Equipment -> MaintenanceTeam
        const report = await Request.findAll({
            attributes: [
                [sequelize.col('Equipment.MaintenanceTeam.name'), 'team_name'],
                [sequelize.fn('COUNT', sequelize.col('Request.id')), 'request_count']
            ],
            include: [{
                model: Equipment,
                attributes: [],
                include: [{
                    model: MaintenanceTeam,
                    attributes: []
                }]
            }],
            group: ['Equipment.MaintenanceTeam.name'],
            raw: true
        });

        res.json(report);
    } catch (error) {
        console.error('Error fetching requests per team:', error);
        res.status(500).json({ message: 'Server error fetching team reports' });
    }
};

// Get Requests count per Equipment
exports.getRequestsPerEquipment = async (req, res) => {
    try {
        const report = await Request.findAll({
            attributes: [
                [sequelize.col('Equipment.name'), 'equipment_name'],
                [sequelize.fn('COUNT', sequelize.col('Request.id')), 'request_count']
            ],
            include: [{
                model: Equipment,
                attributes: []
            }],
            group: ['Equipment.name', 'Equipment.id'], // Group by ID to handle same names potentially
            order: [[sequelize.fn('COUNT', sequelize.col('Request.id')), 'DESC']],
            limit: 10, // Top 10 equipment with most requests
            raw: true
        });

        res.json(report);
    } catch (error) {
        console.error('Error fetching requests per equipment:', error);
        res.status(500).json({ message: 'Server error fetching equipment reports' });
    }
};

// Get Requests count per Status
exports.getRequestsPerStatus = async (req, res) => {
    try {
        const report = await Request.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'request_count']
            ],
            group: ['status'],
            raw: true
        });

        res.json(report);
    } catch (error) {
        console.error('Error fetching requests per status:', error);
        res.status(500).json({ message: 'Server error fetching status reports' });
    }
};
