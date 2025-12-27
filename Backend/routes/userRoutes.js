const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const checkRole = require('../middleware/roleMiddleware');

// Get all users (Admin & Manager)
router.get('/', auth, checkRole(['Admin', 'Manager']), getUsers);

// Update Role (Admin only)
router.put('/:id/role', auth, checkRole(['Admin']), updateUserRole);

// Update Status (Admin only)
router.put('/:id/status', auth, checkRole(['Admin']), updateUserStatus);

module.exports = router;
