const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Half-Day'], required: true },
  checkIn: Date,
  checkOut: Date,
  workHours: Number,
  notes: String
}, { timestamps: true });

// Prevent duplicate attendance records for the same user on the same day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);