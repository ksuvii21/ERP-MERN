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

  // --- Comprehensive Validation ---
  const requiredCompanyFields = ['name', 'industryType', 'companySize', 'country', 'timezone'];
  const requiredAdminFields = ['name', 'email', 'password'];

  const missingCompanyFields = requiredCompanyFields.filter(field => !company?.[field]);
  const missingAdminFields = requiredAdminFields.filter(field => !admin?.[field]);

  if (missingCompanyFields.length > 0 || missingAdminFields.length > 0) {
    const missingFields = [
      ...missingCompanyFields.map(f => `company.${f}`),
      ...missingAdminFields.map(f => `admin.${f}`)
    ];
    res.status(400);
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  // 1. Check if user or company already exist
  const userExists = await User.findOne({ email: admin.email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists.');
  }

  const companyExists = await Company.findOne({ name: company.name });
  if (companyExists) {
    res.status(400);
    throw new Error('A company with this name already exists.');
  }

  // Create the user instance first
  const adminUser = new User({
    name: admin.name,
    email: admin.email,
    password: admin.password,
    role: ROLES.ADMIN,
    status: 'active',
    permissions: ROLE_PERMISSIONS[ROLES.ADMIN] || [],
  });

  try {
    // --- Step 1: Save the Admin User ---
    const savedAdmin = await adminUser.save();

    try {
      // --- Step 2: If user is saved, create and save the Company ---
      const newCompany = new Company({
        ...company,
        owner: savedAdmin._id,
      });
      const savedCompany = await newCompany.save();

      // --- Step 3: Link the company back to the user and save again ---
      savedAdmin.company = savedCompany._id;
      await savedAdmin.save();

      // --- Step 4: All successful, send response ---
      res.status(201).json({
        _id: savedAdmin._id,
        name: savedAdmin.name,
        email: savedAdmin.email,
        role: savedAdmin.role,
        company: savedCompany,
        permissions: savedAdmin.permissions,
        token: generateToken(savedAdmin._id, savedAdmin.role),
      });

    } catch (companyError) {
      // --- Rollback: If company creation fails, delete the admin user ---
      await User.findByIdAndDelete(savedAdmin._id);

      // --- Enhanced Error Logging & Response ---
      console.error('--- COMPANY CREATION FAILED ---');
      console.error('Timestamp:', new Date().toISOString());
      console.error('Error Details:', companyError);
      console.error('--- END OF ERROR ---');

      if (companyError.name === 'ValidationError') {
        const messages = Object.values(companyError.errors).map(val => val.message);
        // Directly send the detailed validation response
        return res.status(400).json({ message: `Company validation failed: ${messages.join(', ')}` });
      }
      
      // For other unexpected errors during company creation
      return res.status(400).json({ message: 'Failed to create company profile. Please check server logs for details.' });
    }
  } catch (userError) {
    // --- Enhanced Error Logging & Response ---
    console.error('--- USER CREATION FAILED ---');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error Details:', userError);
    console.error('--- END OF ERROR ---');

    if (userError.name === 'ValidationError') {
        const messages = Object.values(userError.errors).map(val => val.message);
        // Directly send the detailed validation response
        return res.status(400).json({ message: `User validation failed: ${messages.join(', ')}` });
    }

    // For other errors (like duplicate key on user), send a specific message
    return res.status(400).json({ message: userError.message || 'User registration failed. An unexpected error occurred.' });
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