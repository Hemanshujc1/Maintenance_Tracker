const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const upload = require('../middleware/uploadMiddleware');

// Apply protection to all routes
router.use(protect);

router.post('/', upload.single('image'), requestController.createRequest);
router.get('/', requestController.getAllRequests);
router.get('/:id', requestController.getRequestById);
router.put('/:id/status', requestController.updateRequestStatus);
router.put('/:id/assign', requestController.assignTechnician);
router.put('/:id/duration', requestController.updateDuration);

module.exports = router;
