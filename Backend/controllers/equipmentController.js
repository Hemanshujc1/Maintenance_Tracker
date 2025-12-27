const { pool } = require('../config/db');

// Get all equipment
const getAllEquipment = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM equipment ORDER BY created_at DESC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching equipment:', err);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
};

// Get single equipment by ID
const getEquipmentById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM equipment WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error fetching equipment:', err);
        res.status(500).json({ error: 'Failed to fetch equipment details' });
    }
};

// Create new equipment
const createEquipment = async (req, res) => {
    const {
        name,
        serial_number,
        description,
        purchase_date,
        warranty_expiry,
        location,
        status,
        department_id,
        assigned_employee_id,
        maintenance_team_id
    } = req.body;

    try {
        const [result] = await pool.query(
            `INSERT INTO equipment 
            (name, serial_number, description, purchase_date, warranty_expiry, location, status, department_id, assigned_employee_id, maintenance_team_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name,
                serial_number,
                description,
                purchase_date || null,
                warranty_expiry || null,
                location,
                status || 'Active',
                department_id || null,
                assigned_employee_id || null,
                maintenance_team_id || null
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Equipment created successfully' });
    } catch (err) {
        console.error('Error creating equipment:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Serial number already exists' });
        }
        res.status(500).json({ error: 'Failed to create equipment' });
    }
};

// Update equipment
const updateEquipment = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        serial_number,
        description,
        purchase_date,
        warranty_expiry,
        location,
        status,
        department_id,
        assigned_employee_id,
        maintenance_team_id
    } = req.body;

    try {
        const [result] = await pool.query(
            `UPDATE equipment SET 
            name = ?, serial_number = ?, description = ?, purchase_date = ?, warranty_expiry = ?, location = ?, status = ?, department_id = ?, assigned_employee_id = ?, maintenance_team_id = ? 
            WHERE id = ?`,
            [
                name,
                serial_number,
                description,
                purchase_date || null,
                warranty_expiry || null,
                location,
                status,
                department_id || null,
                assigned_employee_id || null,
                maintenance_team_id || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        res.json({ message: 'Equipment updated successfully' });
    } catch (err) {
        console.error('Error updating equipment:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Serial number already exists' });
        }
        res.status(500).json({ error: 'Failed to update equipment' });
    }
};

// Scrap equipment (Partial Update)
const scrapEquipment = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query(
            'UPDATE equipment SET status = ? WHERE id = ?',
            ['Scrapped', id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

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
