const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  industries: [{
    type: String, // e.g., "Retail", "Healthcare"
  }],
  rolesAllowed: [{
    type: String, // e.g., "Admin", "Manager"
  }],
}, { timestamps: true });

module.exports = mongoose.model('Module', ModuleSchema);