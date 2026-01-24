const mongoose = require('mongoose');
const { ROLES } = require('../config/roles.js'); // Import roles from your config

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false, // Don't send back password by default
  },
  role: {
    type: String,
    enum: Object.values(ROLES), // Use the roles from your config file
    default: ROLES.EMPLOYEE,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
