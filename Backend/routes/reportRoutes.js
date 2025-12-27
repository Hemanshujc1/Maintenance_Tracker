const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/teams - Get requests count per team
router.get('/teams', reportController.getRequestsPerTeam);

// GET /api/reports/equipment - Get requests count per equipment
router.get('/equipment', reportController.getRequestsPerEquipment);

module.exports = router;
