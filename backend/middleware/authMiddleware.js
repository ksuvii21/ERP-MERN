const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');

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

      // Get company from the token's ID and attach to request
      req.company = await Company.findById(decoded.id).select('-password');

      // Attach user role from token to the request for authorization
      req.user = { role: decoded.role };

      if (!req.company) {
        res.status(401);
        throw new Error('Not authorized, company not found');
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

module.exports = { protect, authorize };