const asyncHandler = require('express-async-handler');

const checkPermission = (requiredPermission) => {
  return asyncHandler(async (req, res, next) => {
    // Ensure user is logged in (protect middleware should run before this)
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user found');
    }

    // Check if user has the specific permission or is an admin
    if (req.user.role === 'admin' || (req.user.permissions && req.user.permissions.includes(requiredPermission))) {
      next();
    } else {
      res.status(403);
      throw new Error(`Access denied. Requires permission: ${requiredPermission}`);
    }
  });
};

module.exports = { checkPermission };