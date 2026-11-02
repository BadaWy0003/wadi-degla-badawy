const express = require('express');
const ProjectsController = require('../controllers/projects.controller');
const { adminAuth } = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const validate = require('../middlewares/request-validator.middleware');
const { uploadPhotos } = require('../middlewares/upload-photos.middleware');
const {
  createProjectReqSchema,
  updateProjectReqSchema,
  countryReqSchema,
  hiddenReqSchema,
  moveReqSchema,
} = require('../validations/projects.validation.schema');

const router = express.Router();

// Like news: ADMIN and SUPER_ADMIN only (not MODERATOR), owner decision 2026-11-02.
const admin = [adminAuth, authorize('ADMIN')];

// Public: visible projects in page order, used by the website build.
router.get('/', ProjectsController.listPublic);

// Admin panel
router.get('/admin/all', ...admin, ProjectsController.listAll);
router.post('/admin/import', ...admin, ProjectsController.importExisting);
router.post('/admin/photos', ...admin, uploadPhotos, ProjectsController.uploadPhotos);

router.post('/admin/countries', ...admin, validate(countryReqSchema), ProjectsController.createCountry);
router.put('/admin/countries/:id', ...admin, validate(countryReqSchema), ProjectsController.updateCountry);
router.put('/admin/countries/:id/move', ...admin, validate(moveReqSchema), ProjectsController.moveCountry);
router.delete('/admin/countries/:id', ...admin, ProjectsController.removeCountry);

router.post('/admin', ...admin, validate(createProjectReqSchema), ProjectsController.create);
router.get('/admin/:id', ...admin, ProjectsController.get);
router.put('/admin/:id', ...admin, validate(updateProjectReqSchema), ProjectsController.update);
router.put('/admin/:id/visibility', ...admin, validate(hiddenReqSchema), ProjectsController.setHidden);
router.put('/admin/:id/move', ...admin, validate(moveReqSchema), ProjectsController.move);
router.delete('/admin/:id', ...admin, ProjectsController.remove);

module.exports = router;
