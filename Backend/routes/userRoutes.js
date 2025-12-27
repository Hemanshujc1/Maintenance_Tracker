const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Get all users (Admin & Manager)
router.get('/', protect, checkRole(['Admin', 'Manager']), getUsers);

// Update Role (Admin & Manager)
router.put('/:id/role', protect, checkRole(['Admin', 'Manager']), updateUserRole);

// Update Status (Admin & Manager)
router.put('/:id/status', protect, checkRole(['Admin', 'Manager']), updateUserStatus);

module.exports = router;
