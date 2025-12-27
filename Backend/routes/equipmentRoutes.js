const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

const protect = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

// Routes
// View: All authenticated users (Logic varies by role in controller)
router.get('/', protect, equipmentController.getAllEquipment);
router.get('/:id', protect, equipmentController.getEquipmentById);

// Modify: Admin, Manager, Technician only
router.post('/', protect, authorize('Admin', 'Manager', 'Technician'), equipmentController.createEquipment);
router.put('/:id', protect, authorize('Admin', 'Manager', 'Technician'), equipmentController.updateEquipment);
router.put('/:id/scrap', protect, authorize('Admin', 'Manager', 'Technician'), equipmentController.scrapEquipment);

module.exports = router;
