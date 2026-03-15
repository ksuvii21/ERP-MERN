const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all audit logs for the company with search
// @route   GET /api/audit-logs
// @access  Private (Admin/Manager)
router.get('/', protect, async (req, res) => {
  try {
    const { search, limit = 25, page = 1, startDate, endDate } = req.query;
    
    let query = { company: req.user.company };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { userName: searchRegex },
        { action: searchRegex },
        { entity: searchRegex }
      ];
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        // Add one day to endDate to include the whole day
        $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
      };
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalLogs = await AuditLog.countDocuments(query);

    res.json({
      logs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalLogs / parseInt(limit)),
      totalLogs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @desc    Get audit logs for a specific patient
// @route   GET /api/audit-logs/patient/:patientId
// @access  Private
router.get('/patient/:patientId', protect, async (req, res) => {
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