const Company = require('../models/Company');
const asyncHandler = require('express-async-handler'); // npm i express-async-handler
const jwt = require('jsonwebtoken'); // npm i jsonwebtoken
const { ROLES } = require('../config/roles');
const bcrypt = require('bcryptjs');

// Generate JWT
const generateToken = (id, role) => {
  if (!process.env.JWT_SECRET) {
    // This is a critical server configuration error.
    console.error('FATAL ERROR: JWT_SECRET is not defined in .env file.');
    throw new Error('Server configuration error, cannot sign authentication tokens.');
  }
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new company
 * @route   POST /api/auth/register-company
 * @access  Public
 */
const registerCompanyAndAdmin = asyncHandler(async (req, res) => {
  const { company, admin } = req.body;

  if (!company || !admin || !admin.email || !admin.password || !company.name) {
    res.status(400);
    throw new Error('Please provide all required fields for company and admin');
  }

  // 1. Check if company with that email or name already exists
  const emailExists = await Company.findOne({ email: admin.email });
  if (emailExists) {
    res.status(400);
    throw new Error('A company with this email already exists.');
  }

  const companyExists = await Company.findOne({ name: company.name });
  if (companyExists) {
    res.status(400);
    throw new Error('A company with this name already exists.');
  }

  // 2. Create the company with admin details
  const newCompany = await Company.create({
    name: company.name,
    industry: company.industry,
    companySize: company.companySize,
    country: company.country,
    timezone: company.timezone,
    email: admin.email,
    password: admin.password, // Password will be hashed by the pre-save hook
  });

  if (newCompany) {
    // 3. Respond with company data and a token
    res.status(201).json({
      _id: newCompany._id,
      name: newCompany.name,
      email: newCompany.email,
      role: ROLES.ADMIN,
      token: generateToken(newCompany._id, ROLES.ADMIN),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data, registration failed.');
  }
});

/**
 * @desc    Authenticate a company & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Check for email and password
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide an email and password');
  }

  // 2. Check if company exists and get password
  const company = await Company.findOne({ email }).select('+password');

  if (!company) {
    // For security, we send a generic message to the client.
    // The console log is for server-side debugging.
    console.log(`Auth-Debug: Login failed. Company not found for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, company.password);

  if (isMatch) {
    // 3. If password matches, send back data and token
    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      role: ROLES.ADMIN, // Assign admin role on login
      token: generateToken(company._id, ROLES.ADMIN),
    });
  } else {
    console.log(`Auth-Debug: Login failed. Incorrect password for email: ${email}`);
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

module.exports = { registerCompanyAndAdmin, loginCompany };