const asyncHandler = require('express-async-handler');

const checkPermission = (requiredPermission) => {
  return asyncHandler(async (req, res, next) => {
    // Ensure user is logged in (protect middleware should run before this)
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    // Allow if user is admin OR has the specific permission
    // This ensures existing Admins don't get locked out when new permissions are added
    if (user.role === 'admin' || (user.permissions && user.permissions.includes(requiredPermission))) {
      next();
    } else {
      res.status(403).json({ message: `Access denied. Requires permission: ${requiredPermission}` });
    }
  });
};

module.exports = { checkPermission };