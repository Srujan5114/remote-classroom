// Middleware to restrict access based on user roles
// Usage: authorizeRoles('admin', 'teacher')
module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please log in.' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Requires one of these roles: ${roles.join(', ')}`
      });
    }
    next();
  };
};
