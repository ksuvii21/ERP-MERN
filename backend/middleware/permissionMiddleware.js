const asyncHandler = require('express-async-handler');

const checkPermission = (requiredPermission) => {
  return asyncHandler(async (req, res, next) => {
    // Ensure user is logged in (protect middleware should run before this)
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    // The 'admin' role is assigned all permissions upon creation,
    // so we can rely on the permissions array for all roles.
    if (user.permissions && user.permissions.includes(requiredPermission)) {
      next();
    } else {
      res.status(403).json({ message: `Access denied. Requires permission: ${requiredPermission}` });
    }
  });
};

module.exports = { checkPermission };