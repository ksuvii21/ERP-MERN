const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const auth = require('../middleware/auth');

// @desc    Get audit logs for a specific patient
// @route   GET /api/audit-logs/patient/:patientId
// @access  Private
router.get('/patient/:patientId', auth, async (req, res) => {
  try {
    // Ensure the user is authorized to see logs for this company
    const logs = await AuditLog.find({
      company: req.user.company,
      entityId: req.params.patientId,
    }).sort({ createdAt: -1 }).limit(50); // Limit to recent 50 logs

    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;