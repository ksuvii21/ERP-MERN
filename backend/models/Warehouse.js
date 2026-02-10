const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: String,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['Warehouse', 'Store', 'Godown'], default: 'Warehouse' }
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);