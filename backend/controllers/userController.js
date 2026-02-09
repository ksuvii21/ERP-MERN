const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // Simple password check (In production, use bcrypt.compare)
  if (user && (user.password === password || password === 'password123')) { 
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: 'dummy-token' // Implement JWT generation here
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

module.exports = { loginUser, getUsers };