// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    // JWT verification logic
    // Role checking if roles array provided
  }
}