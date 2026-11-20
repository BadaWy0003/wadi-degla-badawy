const express = require('express');
const OverviewService = require('../services/overview.service');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

// Admin panel home page: numbers and "needs attention" items (overview.service.js).
// Moderators get the stone checks; Admins and Super Admins everything.
const router = express.Router();

router.get('/admin', adminAuth, authorize('MODERATOR'), async (req, res) => {
  try {
    res.status(200).json({ data: await OverviewService.get(req.user?.role) });
  } catch (error) {
    console.error('Overview error:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
