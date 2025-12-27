const Equipment = require('../models/Equipment');

const Request = require('../models/Request');

// Get all equipment
const getAllEquipment = async (req, res) => {
    try {
        let whereClause = {};

        // If user is just an Employee, only show assigned equipment
        if (req.user.role === 'Employee') {
            whereClause = { assigned_employee_id: req.user.id };
        }

        const equipment = await Equipment.findAll({
            where: whereClause,
            include: [{
                model: Request,
                attributes: ['id', 'status', 'priority']
            }],
            order: [['created_at', 'DESC']]
        });
        res.json(equipment);
    } catch (err) {
        console.error('Error fetching equipment:', err);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
};

// Get single equipment by ID
const getEquipmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const equipment = await Equipment.findByPk(id);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.json(equipment);
    } catch (err) {
        console.error('Error fetching equipment:', err);
        res.status(500).json({ error: 'Failed to fetch equipment details' });
    }
};

// Create new equipment
const createEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.create(req.body);
        res.status(201).json({ id: equipment.id, message: 'Equipment created successfully', equipment });
    } catch (err) {
        console.error('Error creating equipment:', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Serial number already exists' });
        }
        res.status(500).json({ error: 'Failed to create equipment' });
    }
};

// Update equipment
const updateEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const equipment = await Equipment.findByPk(id);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        await equipment.update(req.body);
        res.json({ message: 'Equipment updated successfully', equipment });
    } catch (err) {
        console.error('Error updating equipment:', err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ error: 'Serial number already exists' });
        }
        res.status(500).json({ error: 'Failed to update equipment' });
    }
};

// Scrap equipment (Partial Update)
const scrapEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const equipment = await Equipment.findByPk(id);
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        await equipment.update({ status: 'Scrapped' });
        res.json({ message: 'Equipment marked as scrapped' });
    } catch (err) {
        console.error('Error scrapping equipment:', err);
        res.status(500).json({ error: 'Failed to scrap equipment' });
    }
};

module.exports = {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    scrapEquipment
};
