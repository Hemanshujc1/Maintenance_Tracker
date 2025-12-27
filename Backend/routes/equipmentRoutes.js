const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

// Routes
router.get('/', equipmentController.getAllEquipment);
router.post('/', equipmentController.createEquipment);
router.get('/:id', equipmentController.getEquipmentById);
router.put('/:id', equipmentController.updateEquipment);
router.put('/:id/scrap', equipmentController.scrapEquipment);

module.exports = router;
