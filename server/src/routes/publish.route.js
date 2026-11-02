const express = require('express');
const PublishService = require('../services/publish.service');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');

// "Publish to website" for everything the website reads at build time (news, projects).
// Same as /api/news/admin/publish, which stays for the News page.
const router = express.Router();
const admin = [adminAuth, authorize('ADMIN')];

const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json({ data: await fn(req) });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Publish error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

router.get(
  '/',
  ...admin,
  handle(() => PublishService.status()),
);
router.post(
  '/',
  ...admin,
  handle((req) => PublishService.publish(req.user?.email || req.user?.id || null)),
);

module.exports = router;
