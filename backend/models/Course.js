const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  code: { type: String, required: true },
  credits: { type: Number, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Course', courseSchema);