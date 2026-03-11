const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const User = require('../models/User');
const { ROLES, PERMISSIONS } = require('../config/roles');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      // For regular users, enforce company association.
      // Super Admin can operate without being tied to a single company.
      if (req.user.role !== ROLES.SUPER_ADMIN) {
        if (!req.user.company) {
          res.status(401);
          throw new Error('Not authorized, user is not associated with a company');
        }
        // Get the user's company and attach to request
        req.company = await Company.findById(req.user.company);

        if (!req.company) {
          res.status(401);
          throw new Error('Not authorized, company not found for user');
        }
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error('You do not have permission to perform this action.');
    }
    next();
  };
};

const hasPermission = (...requiredPermissions) => {
  return (req, res, next) => {
    // This middleware should run after the 'protect' middleware,
    // so req.user should be available.
    if (!req.user || !req.user.role) {
      res.status(403);
      throw new Error('Not authorized, user role is missing.');
    }

    const userPermissions = PERMISSIONS[req.user.role] || [];

    // Admins with 'all' permission can access anything
    if (userPermissions.includes('all')) {
      return next();
    }

    // Check if the user has at least one of the required permissions
    const hasRequiredPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission)
    );

    if (!hasRequiredPermission) {
      res.status(403);
      throw new Error('Not authorized, you do not have the required permissions.');
    }
    next();
  };
};

module.exports = { protect, authorize, hasPermission };