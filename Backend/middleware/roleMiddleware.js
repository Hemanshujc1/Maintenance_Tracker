module.exports = function (roles) {
  return (req, res, next) => {
    // Convert both to same case for comparison, though schema is InitCase ('Admin')
    // roles check array should probably also match schema or be flexible
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
    }
    next();
  };
};
