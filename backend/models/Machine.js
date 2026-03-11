const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  status: {
    type: String,
    required: true,
    enum: ['Running', 'Idle', 'Maintenance', 'Offline'],
    default: 'Idle',
  },
  lastMaintenanceDate: { type: Date },
  nextMaintenanceDate: { type: Date },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);