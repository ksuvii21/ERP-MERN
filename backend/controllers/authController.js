const Company = require('../models/Company');
const User = require('../models/User');
const asyncHandler = require('express-async-handler'); // npm i express-async-handler
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const { ROLES } = require('../config/roles'); 
const bcrypt = require('bcryptjs');
const { ROLE_PERMISSIONS } = require('../config/permissions');

const generateToken = require('../utils/generateToken');

/**
 * @desc    Register a new company
 * @route   POST /api/auth/register-company
 * @access  Public
 */
const registerCompanyAndAdmin = asyncHandler(async (req, res) => {
  const { company, admin } = req.body;

  if (!company || !admin || !admin.name || !admin.email || !admin.password || !company.name) {
    res.status(400);
    throw new Error('Please provide company name, admin name, email, and password.');
  }

  // 1. Check if user or company already exist
  const userExists = await User.findOne({ email: admin.email });
  if (userExists) {
    res.status(400);
    throw new Error('A company with this email already exists.');
  }

  const companyExists = await Company.findOne({ name: company.name });
  if (companyExists) {
    res.status(400);
    throw new Error('A company with this name already exists.');
  }

  try {
    const adminUser = new User({
      name: admin.name,
      email: admin.email,
      password: admin.password,
      role: ROLES.ADMIN,
      permissions: ROLE_PERMISSIONS[ROLES.ADMIN] || [], // Assign Admin permissions
      // Company will be set after company is created
    });

    const newCompany = new Company({
      ...company,
      industryType: company.industry, // Map frontend 'industry' to DB 'industryType'
      owner: adminUser._id,
    });

    adminUser.company = newCompany._id;
    await newCompany.save();
    await adminUser.save();

    res.status(201).json({
      _id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      role: adminUser.role,
      company: newCompany,
      permissions: adminUser.permissions,
      token: generateToken(adminUser._id, adminUser.role),
    });
  } catch (error) {
    res.status(400);
    throw new Error('User registration failed. ' + error.message);
  }
});

/**
 * @desc    Authenticate a user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for email and password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  // 2. Check if user exists and get password
  const user = await User.findOne({ email }).select('+password').populate('company');

  if (!user) {
    // For security, we send a generic message to the client.
    // The console log is for server-side debugging.
    console.log(`Auth-Debug: Login failed. User not found for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (isMatch) {
    // 3. If password matches, send back data and token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      permissions: user.permissions,
      token: generateToken(user._id, user.role),
    });
  } else {
    console.log(`Auth-Debug: Login failed. Incorrect password for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = { registerCompanyAndAdmin, loginUser };