const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

// GET /api/reports/teams - Get requests count per team
router.get('/teams', reportController.getRequestsPerTeam);

// GET /api/reports/equipment - Get requests count per equipment
router.get('/equipment', reportController.getRequestsPerEquipment);

// GET /api/reports/status - Get requests count per status
router.get('/status', reportController.getRequestsPerStatus);

module.exports = router;
