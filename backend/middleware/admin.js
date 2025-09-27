// backend/middleware/admin.js

function admin(req, res, next) {
  // This middleware should run *after* the 'auth' middleware
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
}

module.exports = admin;