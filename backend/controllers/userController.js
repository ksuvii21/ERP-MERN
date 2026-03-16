const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const User = require('../models/User');
const { ROLES } = require('../config/roles');
const { PERMISSIONS } = require('../config/roles');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail'); // You'll need to create this utility

// @desc    Invite a new user to the company
// @route   POST /api/users/invite
// @access  Private (Admin)
const inviteUser = asyncHandler(async (req, res) => {
  let { email, role } = req.body;

  if (!email || !role) {
    res.status(400);
    throw new Error('Please provide an email and a role.');
  }

  role = role.toLowerCase();

  // Validate against all possible roles
  if (!Object.values(ROLES).includes(role)) {
    res.status(400);
    throw new Error('Invalid role specified.');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('A user with this email already exists.');
  }

  // Generate a secure one-time invitation token
  const invitationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name: 'Invited User',
    email,
    role,
    company: req.company._id,
    status: 'pending',
    permissions: PERMISSIONS[role] || [], // Assign default permissions for the role
    invitationToken, // Ensure this field exists in your User Schema
    password: crypto.randomBytes(16).toString('hex'), // Temporary random password
  });

  // Construct the URL for your React Frontend (Vite uses 5173 by default)
  const inviteUrl = `${req.protocol}://${req.get('host').replace('5000', '5173')}/accept-invitation?email=${encodeURIComponent(email)}&token=${invitationToken}`;

  const message = `
    <h1>Welcome to KNexis ERP</h1>
    <p>You have been invited to join <strong>${req.company.name}</strong> as a <strong>${role}</strong>.</p>
    <p>Please click the link below to set your password and activate your account:</p>
    <a href="${inviteUrl}" style="background: #0d9488; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Set Up Account</a>
    <p>If the button doesn't work, copy and paste this link:</p>
    <p>${inviteUrl}</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Invitation to join KNexis',
      message,
    });

    res.status(201).json({
      message: `Invitation email sent to ${email}.`,
      user: { email: user.email, role: user.role, status: user.status }
    });
  } catch (error) {
    // If email fails, remove the pending user so the admin can try again
    await User.findByIdAndDelete(user._id);
    res.status(500);
    throw new Error('Email could not be sent. Please check your SMTP settings.');
  }
});

// @desc    Accept an invitation and complete registration
// @route   POST /api/users/accept-invitation
// @access  Public
const acceptInvitation = asyncHandler(async (req, res) => {
  const { email, name, password, token } = req.body;

  if (!email || !name || !password || !token) {
    res.status(400);
    throw new Error('All fields are required.');
  }

  // Find user by email, token, and ensure they are still pending
  const user = await User.findOne({ 
    email, 
    invitationToken: token, 
    status: 'pending' 
  });

  if (!user) {
    res.status(404);
    throw new Error('Invalid or expired invitation link.');
  }

  // Update user details
  user.name = name;
  user.password = password; // Your pre-save hook in the User model should hash this
  user.status = 'active';
  user.invitationToken = undefined; // Clear the token so it can't be reused

  await user.save();

  // Fix: Populate company so frontend gets industryType immediately
  await user.populate('company');

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company, // Fix: Send company data
    token: generateToken(user._id, user.role),
  });
});

// @desc    Get all users for the logged-in company
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ company: req.company._id }).select('-password');
  res.status(200).json(users);
});

// @desc    Delete a user from the company
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user && user.company.toString() === req.company._id.toString()) {
    await user.deleteOne();
    res.status(200).json({ message: 'User removed successfully.' });
  } else {
    res.status(404);
    throw new Error('User not found or unauthorized.');
  }
});

module.exports = { getUsers, inviteUser, deleteUser, acceptInvitation };