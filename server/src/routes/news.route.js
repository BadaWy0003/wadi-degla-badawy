const express = require('express');
const NewsController = require('../controllers/news.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/request-validator.middleware');
const { uploadPhotos } = require('../middlewares/upload-photos.middleware');
const {
  createNewsReqSchema,
  updateNewsReqSchema,
  hiddenReqSchema,
  pinnedReqSchema,
} = require('../validations/news.validation.schema');

const router = express.Router();

// News can be managed by ADMIN and SUPER_ADMIN (not MODERATOR), owner decision 2026-11-02.
const admin = [adminAuth, authorize('ADMIN')];

// Public: visible articles, used by the website build.
router.get('/', NewsController.listPublic);

// Admin panel
router.get('/admin/all', ...admin, NewsController.listAll);
router.get('/admin/publish', ...admin, NewsController.publishStatus);
router.post('/admin/publish', ...admin, NewsController.publish);
router.post('/admin/import', ...admin, NewsController.importExisting);
router.post('/admin/photos', ...admin, uploadPhotos, NewsController.uploadPhotos);
router.post('/admin', ...admin, validate(createNewsReqSchema), NewsController.create);
router.get('/admin/:id', ...admin, NewsController.get);
router.put('/admin/:id', ...admin, validate(updateNewsReqSchema), NewsController.update);
router.put('/admin/:id/visibility', ...admin, validate(hiddenReqSchema), NewsController.setHidden);
router.put('/admin/:id/pin', ...admin, validate(pinnedReqSchema), NewsController.setPinned);
router.delete('/admin/:id', ...admin, NewsController.remove);

module.exports = router;
