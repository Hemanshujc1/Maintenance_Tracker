const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id/status', requestController.updateRequestStatus);
router.put('/:id/assign', requestController.assignTechnician);
router.put('/:id/duration', requestController.updateDuration);

module.exports = router;
