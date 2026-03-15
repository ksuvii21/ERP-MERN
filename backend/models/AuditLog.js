const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { // Denormalize for easier display
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: [
      'CREATE_PATIENT',
      'UPDATE_PATIENT',
      'UPDATE_PATIENT_PRIVACY',
      'DELETE_PATIENT',
      'ACCESS_PATIENT_RECORD',
      'CREATE_APPOINTMENT',
      'UPDATE_APPOINTMENT_STATUS',
      'RESCHEDULE_APPOINTMENT',
    ],
  },
  entity: {
    type: String,
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('AuditLog', auditLogSchema);