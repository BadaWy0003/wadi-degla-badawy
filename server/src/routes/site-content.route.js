const express = require('express');
const Joi = require('joi');
const SiteContentController = require('../controllers/site-content.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/request-validator.middleware');
const { uploadPhotos } = require('../middlewares/upload-photos.middleware');

const router = express.Router();

// Like news and projects: ADMIN and SUPER_ADMIN only (owner decision 2026-11-17), and they
// publish without an approval step.
const admin = [adminAuth, authorize('ADMIN')];

// The body's shape only; every field is checked against src/content/blocks.js by the service.
const saveReqSchema = {
  body: Joi.object({
    texts: Joi.object()
      .pattern(/^[A-Za-z0-9_.]{1,120}$/, Joi.object())
      .max(500)
      .required(),
    data: Joi.object()
      .pattern(/^[A-Za-z0-9_]{1,60}$/, Joi.any())
      .max(500)
      .required(),
  }),
};
const idParams = Joi.object({
  id: Joi.string()
    .pattern(/^[a-z0-9-]{1,40}$/)
    .required(),
});

// Public: the saved changes of every block, read by the website build.
router.get('/', SiteContentController.listPublic);

// Admin panel
router.get('/admin/blocks', ...admin, SiteContentController.listBlocks);
router.post('/admin/photos', ...admin, uploadPhotos, SiteContentController.uploadPhotos);
router.get('/admin/blocks/:id', ...admin, validate({ params: idParams }), SiteContentController.getBlock);
router.put('/admin/blocks/:id', ...admin, validate({ params: idParams, ...saveReqSchema }), SiteContentController.saveBlock);
router.get('/admin/blocks/:id/versions', ...admin, validate({ params: idParams }), SiteContentController.listVersions);
router.post(
  '/admin/blocks/:id/versions/:versionId/restore',
  ...admin,
  validate({ params: Joi.object({ id: Joi.string().pattern(/^[a-z0-9-]{1,40}$/), versionId: Joi.string().alphanum().max(40) }) }),
  SiteContentController.restoreVersion,
);

module.exports = router;
