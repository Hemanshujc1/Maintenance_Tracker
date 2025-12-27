const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin/Manager
exports.getUsers = async (req, res) => {
  try {
    let whereClause = {};
    
    // RBAC: Managers can only see Technicians and Employees
    if (req.user.role === 'Manager') {
        whereClause.role = ['Technician', 'Employee'];
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] }
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Safety Logic for Managers
    if (req.user.role === 'Manager') {
        if (user.role === 'Admin' || user.role === 'Manager') {
            return res.status(403).json({ message: 'Access denied: Cannot modify Admin or Manager accounts' });
        }
        if (role === 'Admin' || role === 'Manager') {
            return res.status(403).json({ message: 'Access denied: Cannot assign Admin or Manager roles' });
        }
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user status
// @route   PUT /api/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Safety Logic for Managers
    if (req.user.role === 'Manager') {
        if (user.role === 'Admin' || user.role === 'Manager') {
            return res.status(403).json({ message: 'Access denied: Cannot modify Admin or Manager accounts' });
        }
    }

    user.status = status;
    await user.save();

    res.json({ message: 'User status updated', user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
