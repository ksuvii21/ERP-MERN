const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  description: String,
  reference: String, // Invoice #, Bill #, Check #
  entries: [{
    account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    debit: { type: Number, default: 0 },
    credit: { type: Number, default: 0 }
  }],
  totalAmount: { type: Number, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Draft', 'Posted'], default: 'Posted' }
}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', journalEntrySchema);