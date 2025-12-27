const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');

// GET /api/calendar - Get all scheduled requests
router.get('/', calendarController.getCalendarRequests);

// POST /api/calendar/request - Create a scheduled (Preventive) request
router.post('/request', calendarController.createScheduledRequest);

module.exports = router;
