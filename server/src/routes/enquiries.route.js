const express = require('express');
const Joi = require('joi');
const EnquiriesService = require('../services/enquiries.service');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/request-validator.middleware');

// Enquiries inbox (admin panel): the website's contact and sample requests. ADMIN/SUPER_ADMIN
// only, like News and Website. Enquiries are saved by the email route (sendEmail.js).
const router = express.Router();
const admin = [adminAuth, authorize('ADMIN')];

const handle = (fn) => async (req, res) => {
  try {
    res.status(200).json({ data: await fn(req) });
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Enquiries error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const idParams = Joi.object({ id: Joi.string().pattern(/^[A-Za-z0-9]{1,40}$/).required() });
const updateSchema = {
  params: idParams,
  body: Joi.object({
    status: Joi.string().valid(...EnquiriesService.STATUSES),
    note: Joi.string().allow('').max(2000),
  })
    .or('status', 'note')
    .required(),
};

router.get(
  '/admin',
  ...admin,
  handle(() => EnquiriesService.list()),
);
router.get(
  '/admin/count-new',
  ...admin,
  handle(async () => ({ count: await EnquiriesService.countNew() })),
);
router.put(
  '/admin/:id',
  ...admin,
  validate(updateSchema),
  handle((req) => EnquiriesService.update(req.params.id, req.body, req.user?.email || req.user?.id)),
);
router.get('/admin/:id/attachment', ...admin, validate({ params: idParams }), async (req, res) => {
  try {
    const { file, name, type } = await EnquiriesService.attachment(req.params.id);
    res.setHeader('Content-Type', type || 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="${name.replace(/"/g, '')}"`);
    file
      .createReadStream()
      .on('error', (e) => {
        console.error('Enquiry file error:', e.message);
        if (!res.headersSent) res.status(500).end();
        else res.end();
      })
      .pipe(res);
  } catch (error) {
    if (error.statusCode) return res.status(error.statusCode).json({ message: error.message });
    console.error('Enquiry file error:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
