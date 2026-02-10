const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['Present', 'Absent', 'Half-Day', 'Leave'], default: 'Absent' },
  workHours: Number
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);